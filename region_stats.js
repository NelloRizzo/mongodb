[
    {
      $lookup:
        // lookup per ottenere le informazioni delle regioni
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
         * appiattisce l'array delle regioni
         */
        "$region"
    },
    {
      $group:
        // raccolta
        {
          _id: "$region.name",
          superficies_ha: {
            $sum: "$ha"
          },
          superficies_km2: {
            $sum: "$km2"
          },
          people: {
            $sum: "$people"
          }
        }
    },
    {
      $sort: {
        people: -1
      }
    }
  ]