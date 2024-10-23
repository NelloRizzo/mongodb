[
    {
      $graphLookup:
        /**
         * from: The target collection.
         * startWith: Expression to start.
         * connectFromField: Field to connect.
         * connectToField: Field to connect to.
         * as: Name of the array field.
         * maxDepth: Optional max recursion depth.
         * depthField: Optional Name of the depth field.
         * restrictSearchWithMatch: Optional query.
         */
        {
          from: "menu",
          startWith: "$menu",
          connectFromField: "menu",
          connectToField: "title",
          as: "menu_hierarchy",
          maxDepth: 1
        }
    },
    {
      $set:
        /**
         * field: The field name
         * expression: The expression.
         */
        {
          item_1: {
            $arrayElemAt: ["$menu_hierarchy", 0]
          },
          item_2: {
            $arrayElemAt: ["$menu_hierarchy", 1]
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
          path: {
            $concat: [
              {
                $ifNull: ["$item_1.title", ""]
              },
              " > ",
              {
                $ifNull: ["$item_2.title", ""]
              },
              " > ",
              "$title"
            ]
          }
        }
    }
  ]