[
    {
      $set: {
        date: {
          $dateTrunc: {
            date: "$timestamp",
            unit: "minute"
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
          dailyAverageHumidity: {
            $avg: "$humidity",
            window: {
              documents: ["unbounded", "unbounded"]
            }
          }
        }
      }
    },
    {
      $group: {
        _id: "$date",
        averageHumidity: {
          $first: "$dailyAverageHumidity"
        }
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ]