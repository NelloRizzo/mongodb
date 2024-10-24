[
    {
      $project:
        // Ripulitura della struttura e ridenominazione dei campi
        {
          region_id: "$Codice Regione",
          province_id: "$Codice Provincia",
          city_id: "$Codice Comune",
          ha: {
            $toDecimal: {
              $trim: {
                // toglie spazi iniziali e finali
                input: {
                  $replaceAll: {
                    // sostituisce (1)
                    input: {
                      $replaceAll: {
                        // sostituisce (2)
                        input:
                          // (2) a partire dagli ettari come stringa
                          "$Superficie totale (ettari)",
                        find: ".",
                        // (2) cerca il punto
                        replacement: "" // (2) e lo sostituisce con stringa vuota
                      }
                    },
                    find: ",",
                    // (1) cerca la virgola
                    replacement: "." // (1) e la sostituisce col punto
                  }
                }
              }
            }
          },
          km2: {
            // leggi la trasformazione di ha...
            $toDecimal: {
              $trim: {
                input: {
                  $replaceAll: {
                    input: {
                      $replaceAll: {
                        input:
                          "$Superficie totale (Km2)",
                        find: ".",
                        replacement: ""
                      }
                    },
                    find: ",",
                    replacement: "."
                  }
                }
              }
            }
          },
          people: {
            // la popolazione non ha virgole...
            $toInt: {
              $trim: {
                input: {
                  $replaceAll: {
                    input:
                      "$Popolazione residente al Censimento 2011",
                    find: ".",
                    replacement: ""
                  }
                }
              }
            }
          }
        }
    },
    {
      $set: {
        density: {
          $divide: ["$people", "$km2"]
        }
      }
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
          into: "mv_superficies",
          whenMatched: "replace",
          whenNotMatched: "insert"
        }
    }
  ]