import random
import datetime
from pymongo import MongoClient

# Connessione a MongoDB (assicurati che MongoDB sia in esecuzione)
client = MongoClient('mongodb+srv://ennerre:r1zz0.nell0.mong0@cluster0.lh3sthm.mongodb.net/')

# Nome del database e della collezione
db = client['myDatabase']
collection_name = 'sensorData'

# Creazione della collezione Time-Series se non esiste già
# MongoDB 5.0+ supporta collezioni time-series
db.create_collection(
    collection_name,
    timeseries={
        'timeField': 'timestamp',    # Campo che memorizza la data e ora
        'metaField': 'metadata',     # Campo per i metadati opzionali
        'granularity': 'seconds'     # Granularità dei dati: 'seconds', 'minutes', 'hours'
    }
)

# Riferimento alla collezione
collection = db[collection_name]

# Generazione e inserimento di 1000 dati simulati
bulk_data = []
for i in range(1000):
    # Dati simulati
    data_point = {
        "timestamp": datetime.datetime.now() - datetime.timedelta(seconds=(360000 - i)),  # Timestamp decrementale
        "metadata": {
            "sensorId": f"sensor_{random.randint(1, 10)}",
            "location": f"zone_{random.randint(1, 5)}"
        },
        "temperature": round(random.uniform(15.0, 25.0), 2),  # Temperatura simulata
        "humidity": round(random.uniform(30.0, 60.0), 2)      # Umidità simulata
    }
    bulk_data.append(data_point)

# Inserimento in blocco dei dati
collection.insert_many(bulk_data)

print("Inserimento completato!")
