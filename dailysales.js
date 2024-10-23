[
    {
      $sort:
        /**
         * Provide any number of field/order pairs.
         */
        {
          date: 1
        }
    },
    {
      $fill:
        /**
         * sortBy: Syntax is the same as $sort, required if "method" is used in at least one output spec otherwise optional
         * partitionBy: Optional, default is a single partition. Specification is the same as _id in $group (same as partitionBy in window functions).
         * partitionByFields: Optional, set of fields that acts as a compound key to define each partition.
         * output - Required, object for each field to fill in. For a single field, can be a single object.
         * output.<field> - A field to be filled with value, if missing or null in the current document.
         */
        {
          sortBy: {
            date: 1
          },
          output: {
            bootsSold: {
              method: "linear"
            }
            //"sandalsSold":{value: 0},
            //"sneakersSold": {value: 0}
          }
        }
    }
  ]