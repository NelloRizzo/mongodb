[
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
          localField: "province_id",
          foreignField: "_id",
          as: "province"
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
          localField: "region_id",
          foreignField: "_id",
          as: "region"
        }
    },
    {
      $unwind:
        /**
         * path: Path to the array field.
         * includeArrayIndex: Optional name for index.
         * preserveNullAndEmptyArrays: Optional
         *   toggle to unwind null and empty values.
         */
        {
          path: "$province"
        }
    },
    {
      $unwind: "$region"
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
          from: "areas",
          localField: "region.area_id",
          foreignField: "_id",
          as: "area"
        }
    },
    {
      $unwind: "$area"
    },
    {
      $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          region: "$region.name",
          area: "$area.name"
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
          from: "cities",
          localField: "city_id",
          foreignField: "cod_comune",
          as: "city"
        }
    },
    {
      $unwind: "$city"
    },
    {
      $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          city: {
            $concat: [
              "$city.denominazione",
              " (",
              "$province.acronym",
              ")"
            ]
          }
        }
    },
    {
      $unset: ["province._id", "province.region_id"]
    },
    {
      $merge:
        /**
         * into: The target collection.
         * on: Fields to  identify.
         * let: Defined variables.
         * whenMatched: Action for matching docs.
         * whenNotMatched: Action for non-matching docs.
         */
        {
          into: "mv_cities",
          whenMatched: "replace",
          whenNotMatched: "insert"
        }
    }
  ]