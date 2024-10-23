[
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          regione: "$Codice Regione",
          provincia: "$Codice Provincia",
          denominazione: "$Denominazione Comune",
          superficie_ha: {
            $replaceOne: {
              input: {
                $replaceAll: {
                  input:
                    "$Superficie totale (ettari)",
                  find: ".",
                  replacement: ""
                }
              },
              find: ",",
              replacement: "."
            }
          },
          superficie_km2: {
            $replaceOne: {
              input: {
                $replaceAll: {
                  input: "$Superficie totale (Km2)",
                  find: ".",
                  replacement: ""
                }
              },
              find: ",",
              replacement: "."
            }
          }
        }
    },
    {
      $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          superficie_ha: {
            $toDouble: {
              $trim: {
                input: "$superficie_ha"
              }
            }
          },
          superficie_km2: {
            $toDouble: {
              $trim: {
                input: "$superficie_km2"
              }
            }
          }
        }
    },
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          denominazione: {
            $exists: true
          }
        }
    },
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          denominazione: {
            $ne: "ITALIA"
          }
        }
    },
    {
      $group:
        /**
         * _id: The id of the group.
         * fieldN: The first field name.
         */
        {
          _id: {
            regione: "$regione",
            provincia: "$provincia"
          },
          totale_comuni: {
            $count: {}
          },
          superficie_ha: {
            $sum: "$superficie_ha"
          },
          superficie_km2: {
            $sum: "$superficie_km2"
          }
        }
    },
    {
      $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          regione: "$_id.regione",
          provincia: "$_id.provincia",
          superficie_ha_str: {
            $concat: [
              {
                $toString: "$superficie_ha"
              },
              " ha"
            ]
          }
        }
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "regions",
          localField: "regione",
          foreignField: "_id",
          as: "dati_regione"
        }
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          from: "provinces",
          localField: "provincia",
          foreignField: "_id",
          as: "dati_provincia"
        }
    },
    {
      $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          regione: {
            $arrayElemAt: ["$dati_regione", 0]
          },
          provincia: {
            $arrayElemAt: ["$dati_provincia", 0]
          }
        }
    },
    {
      $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          provincia: "$provincia.name",
          regione: "$regione.name"
        }
    },
    {
      $unset:
        /**
         * Provide the field name to exclude.
         * To exclude multiple fields, pass the field names in an array.
         */
        ["dati_regione", "dati_provincia"]
    },
    {
      $match:
        /**
         * query: The query in MQL.
         */
        {
          superficie_ha: {
            $gt: 10000
          }
        }
    },
    {
      $bucket:
        /**
         * groupBy: The expression to group by.
         * boundaries: An array of the lower boundaries for each bucket.
         * default: The bucket name for documents that do not fall within the specified boundaries
         * output: {
         *   outputN: Optional. The output object may contain a single or numerous field names used to accumulate values per bucket.
         * }
         */
        {
          groupBy: "$superficie_ha",
          boundaries: [
            0, 100000, 200000, 300000, 400000
          ],
          default: "> 100000",
          output: {
            totale: {
              $count: {}
            },
            province: {
              $push: "$provincia"
            }
          }
        }
    },
    {
      $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          classificazione: {
            $switch: {
              branches: [
                {
                  case: {
                    $lt: ["$_id", 100000]
                  },
                  then: "Piccolo"
                },
                {
                  case: {
                    $lt: ["$_id", 200000]
                  },
                  then: "Medio"
                },
                {
                  case: {
                    $lt: ["$_id", 300000]
                  },
                  then: "Grande"
                }
              ],
              default: "Altri"
            }
          }
        }
    },
    {
      $lookup:
        /**
         * from: The target collection.
         * localField: The local join field.
         * foreignField: The target join field.
         * as: The name for the results.
         * pipeline: Optional pipeline to run on the foreign collection.
         * let: Optional variables to use in the pipeline field stages.
         */
        {
          localField: "_id",
          foreignField: "_id",
          as: "classificazione_2",
          pipeline: [
            {
              $documents: [
                {
                  _id: 0,
                  description: "Piccolo"
                },
                {
                  _id: 100000,
                  description: "Medio"
                },
                {
                  _id: 200000,
                  description: "Grande"
                },
                {
                  _id: 300000,
                  description: "Altri"
                },
                {
                  _id: "> 300000",
                  description: "Altri"
                }
              ]
            }
          ]
        }
    },
    {
      $facet:
        /**
         * outputFieldN: The first output field.
         * stageN: The first aggregation stage.
         */
        {
          province_piccole: [
            {
              $match: {
                classificazione: "Piccolo"
              }
            },
            {
              $project: {
                _id: 0,
                province: 1
              }
            }
          ],
          altre_province: [
            {
              $match: {
                classificazione: {
                  $ne: "Piccolo"
                }
              }
            },
            {
              $project: {
                _id: 0,
                totale: 1
              }
            }
          ]
        }
    },
    // {
    //   $count:
    //     /**
    //      * Provide the field name for the count.
    //      */
    //     "Totale"
    // }
    // {
    //   $bucketAuto:
    //     /**
    //      * groupBy: The expression to group by.
    //      * buckets: The desired number of buckets
    //      * output: {
    //      *   outputN: Optional. The output object may contain a single or numerous field names used to accumulate values per bucket.
    //      * }
    //      * granularity: Optional number series
    //      */
    //     {
    //       groupBy: "$superficie_ha",
    //       buckets: 3,
    //       output: {
    //         province: {
    //           $push: "$provincia"
    //         }
    //       }
    //     }
    // }
    // {
    //   $bucketAuto:
    //     /**
    //      * groupBy: The expression to group by.
    //      * buckets: The desired number of buckets
    //      * output: {
    //      *   outputN: Optional. The output object may contain a single or numerous field names used to accumulate values per bucket.
    //      * }
    //      * granularity: Optional number series
    //      */
    //     {
    //       groupBy: "$regione",
    //       buckets: 20,
    //       granularity: "E6",
    //       output: {
    //         comuni: {
    //           $push: "$denominazione"
    //         },
    //         totale: {
    //           $sum: 1
    //         }
    //       }
    //     }
    // }
    // {
    //   $sort:
    //     /**
    //      * Provide any number of field/order pairs.
    //      */
    //     {
    //       superficie_km2: -1,
    //       denominazione: 1
    //     }
    // }
    // {
    //   $skip:
    //     /**
    //      * Provide the number of documents to skip.
    //      */
    //     0 // page * pageSize
    // }
    {
      $limit:
        /**
         * Provide the number of documents to limit.
         */
        20 // pageSize
    }
  ]