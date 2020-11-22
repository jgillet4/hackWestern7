import numpy as np
import tensorflow as tf
import os
import json

import distutils


def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """

    print('Hello, stdout!')

    # # Uncomment and populate this variable in your code:
    # PROJECT = 'calcium-centaur-296316'

    # # Build structured log messages as an object.
    # global_log_fields = {}

    # # Add log correlation to nest all log messages.
    # trace_header = request.headers.get('X-Cloud-Trace-Context')

    # if trace_header and PROJECT:
    #     trace = trace_header.split('/')
    #     global_log_fields['logging.googleapis.com/trace'] = (
    #         f"projects/{PROJECT}/traces/{trace[0]}")

    # # Complete a structured log entry.
    # entry = dict(severity='NOTICE',
    #              message='This is the default display field.',
    #              # Log viewer accesses 'component' as jsonPayload.component'.
    #              component='arbitrary-property',
    #              **global_log_fields)

    # print(json.dumps(entry))

    print(request)

    if(request):

        if distutils.version.LooseVersion(tf.__version__) < '2.0':
            raise Exception(
                'This notebook is compatible with TensorFlow 2.0 or higher.')

        SHAKESPEARE_TXT = 'cbt_train.txt'

        def transform(txt):
            return np.asarray([ord(c) for c in txt if ord(c) < 255], dtype=np.int32)

        def input_fn(seq_len=100, batch_size=1024):
            """Return a dataset of source and target sequences for training."""
            with tf.io.gfile.GFile(SHAKESPEARE_TXT, 'r') as f:
                txt = f.read()

            source = tf.constant(transform(txt), dtype=tf.int32)

            ds = tf.data.Dataset.from_tensor_slices(
                source).batch(seq_len+1, drop_remainder=True)

            def split_input_target(chunk):
                input_text = chunk[:-1]
                target_text = chunk[1:]
                return input_text, target_text

            BUFFER_SIZE = 10000
            ds = ds.map(split_input_target).shuffle(
                BUFFER_SIZE).batch(batch_size, drop_remainder=True)

            return ds.repeat()

        EMBEDDING_DIM = 512

    def lstm_model(seq_len=100, batch_size=None, stateful=True):
        """Language model: predict the next word given the current word."""
        source = tf.keras.Input(
            name='seed', shape=(seq_len,), batch_size=batch_size, dtype=tf.int32)

        embedding = tf.keras.layers.Embedding(
            input_dim=256, output_dim=EMBEDDING_DIM)(source)
        lstm_1 = tf.keras.layers.LSTM(
            EMBEDDING_DIM, stateful=stateful, return_sequences=True)(embedding)
        lstm_2 = tf.keras.layers.LSTM(
            EMBEDDING_DIM, stateful=stateful, return_sequences=True)(lstm_1)
        predicted_char = tf.keras.layers.TimeDistributed(
            tf.keras.layers.Dense(256, activation='softmax'))(lstm_2)
        return tf.keras.Model(inputs=[source], outputs=[predicted_char])

    if(request):
        tf.keras.backend.clear_session()

        resolver = tf.distribute.cluster_resolver.TPUClusterResolver(
            tpu='grpc://' + os.environ['COLAB_TPU_ADDR'])
        tf.config.experimental_connect_to_cluster(resolver)
        # This is the TPU initialization code that has to be at the beginning.
        tf.tpu.experimental.initialize_tpu_system(resolver)
        print("All devices: ", tf.config.list_logical_devices('TPU'))

        strategy = tf.distribute.experimental.TPUStrategy(resolver)

        with strategy.scope():
            training_model = lstm_model(seq_len=100, stateful=False)
            training_model.compile(
                optimizer=tf.keras.optimizers.RMSprop(learning_rate=0.01),
                loss='sparse_categorical_crossentropy',
                metrics=['sparse_categorical_accuracy'])

        training_model.fit(
            input_fn(),
            steps_per_epoch=100,
            epochs=25
        )
        training_model.save_weights('/tmp/mice.h5', overwrite=True)

    BATCH_SIZE = 5
    PREDICT_LEN = 250

    # Keras requires the batch size be specified ahead of time for stateful models.
    # We use a sequence length of 1, as we will be feeding in one character at a
    # time and predicting the next character.
    prediction_model = lstm_model(
        seq_len=1, batch_size=BATCH_SIZE, stateful=True)
    prediction_model.load_weights('/tmp/mice.h5')

    # We seed the model with our initial string, copied BATCH_SIZE times

    seed_txt = 'grandmother'
    seed = transform(seed_txt)
    seed = np.repeat(np.expand_dims(seed, 0), BATCH_SIZE, axis=0)

    # First, run the seed forward to prime the state of the model.
    prediction_model.reset_states()
    for i in range(len(seed_txt) - 1):
        prediction_model.predict(seed[:, i:i + 1])

    # Now we can accumulate predictions!
    predictions = [seed[:, -1:]]
    for i in range(PREDICT_LEN):
        last_word = predictions[-1]
        next_probits = prediction_model.predict(last_word)[:, 0, :]

        # sample from our output distribution
        next_idx = [
            np.random.choice(256, p=next_probits[i])
            for i in range(BATCH_SIZE)
        ]
        predictions.append(np.asarray(next_idx, dtype=np.int32))

    generated = ''
    for i in range(BATCH_SIZE):
        print('PREDICTION %d\n\n' % i)
        p = [predictions[j][i] for j in range(PREDICT_LEN)]
        generated = ''.join([chr(c) for c in p])  # Convert back to text
        print(generated)
        print()
        assert len(generated) == PREDICT_LEN, 'Generated text too short'

    print("Output is", generated)
    return 'Hello {}!'.format(escape(generated))


HEllo = {'x': "hellow"}
print(HEllo['x'])
