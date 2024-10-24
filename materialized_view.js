[
    {
      $set: {
        date: {
          $dateTrunc: {
            date: "$timestamp",
            unit: "hour"
          }
        }
      }
    },
    {
      $setWindowFields: {
        partitionBy: "$date",
        sortBy: {
          timestamp: 1
        },
        output: {
          averageHumidity: {
            $avg: "$humidity",
            window: {
              documents: [-2, 0]
            }
          }
        }
      }
    },
    {
      $merge:
        /**
         * Provide the name of the output database and collection.
         */
        {
          into: "historical.sensorData",
          whenMatched: "replace",
          whenNotMatched: "insert"
        }
    }
  ]