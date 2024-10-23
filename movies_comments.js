[
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        title: 1
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
        from: "comments",
        localField: "_id",
        foreignField: "movie_id",
        as: "comments"
      }
  },
  {
    $set:
      /**
       * field: The field name
       * expression: The expression.
       */
      {
        comments_no: {
          $size: "$comments"
        },
        comments: "$comments.text"
      }
  },
  {
    $limit:
      /**
       * Provide the number of documents to limit.
       */
      100
  },
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        comments_no: {
          $ne: 0
        }
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
        path: "$comments"
      }
  },
  {
    $unset:
      /**
       * Provide the field name to exclude.
       * To exclude multiple fields, pass the field names in an array.
       */
      "comments_no"
  }
]