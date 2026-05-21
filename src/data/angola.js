export const provinciasMunicipios = {
  "Bengo": [
    "Ambriz",
    "Bula Atumba",
    "Dande",
    "Dembos",
    "Nambuangongo",
    "Pango Aluquém"
  ],

  "Benguela": [
    "Baía Farta",
    "Balombo",
    "Benguela",
    "Bocoio",
    "Caimbambo",
    "Catumbela",
    "Chongorói",
    "Cubal",
    "Ganda",
    "Lobito"
  ],

  "Bié": [
    "Andulo",
    "Camacupa",
    "Catabola",
    "Chinguar",
    "Chitembo",
    "Cuemba",
    "Cunhinga",
    "Kuito",
    "Nhârea"
  ],

  "Cabinda": [
    "Belize",
    "Buco-Zau",
    "Cabinda",
    "Cacongo"
  ],

  "Cuando Cubango": [
    "Calai",
    "Cuangar",
    "Cuchi",
    "Cuito Cuanavale",
    "Dirico",
    "Longa",
    "Mavinga",
    "Menongue",
    "Nancova",
    "Rivungo"
  ],

  "Cuanza Norte": [
    "Ambaca",
    "Banga",
    "Bolongongo",
    "Cambambe",
    "Cazengo",
    "Golungo Alto",
    "Gonguembo",
    "Lucala",
    "Quiculungo",
    "Samba Caju"
  ],

  "Cuanza Sul": [
    "Amboim",
    "Cassongue",
    "Cela",
    "Conda",
    "Ebo",
    "Kibala",
    "Libolo",
    "Mussende",
    "Porto Amboim",
    "Quilenda",
    "Seles",
    "Sumbe"
  ],

  "Cunene": [
    "Cahama",
    "Cuanhama",
    "Curoca",
    "Namacunde",
    "Ombadja"
  ],

  "Huambo": [
    "Bailundo",
    "Caála",
    "Catchiungo",
    "Chicala-Cholohanga",
    "Chinjenje",
    "Ecunha",
    "Huambo",
    "Londuimbali",
    "Longonjo",
    "Mungo",
    "Ukuma"
  ],

  "Huíla": [
    "Cacula",
    "Caconda",
    "Caluquembe",
    "Chibia",
    "Chicomba",
    "Chipindo",
    "Cuvango",
    "Humpata",
    "Jamba",
    "Lubango",
    "Matala",
    "Quilengues",
    "Quipungo"
  ],

  "Luanda": [
    "Belas",
    "Cacuaco",
    "Cazenga",
    "Ícolo e Bengo",
    "Kilamba Kiaxi",
    "Luanda",
    "Quiçama",
    "Talatona",
    "Viana"
  ],

  "Lunda Norte": [
    "Cambulo",
    "Capenda-Camulemba",
    "Caungula",
    "Chitato",
    "Cuilo",
    "Lubalo",
    "Lóvua",
    "Lucapa",
    "Xa-Muteba"
  ],

  "Lunda Sul": [
    "Cacolo",
    "Dala",
    "Muconda",
    "Saurimo"
  ],

  "Malanje": [
    "Cacuso",
    "Calandula",
    "Cambundi-Catembo",
    "Cangandala",
    "Caombo",
    "Cuaba Nzoji",
    "Cunda-Dia-Baze",
    "Kiwaba Nzoji",
    "Luquembo",
    "Malanje",
    "Marimba",
    "Massango",
    "Mucari",
    "Quela",
    "Quirima"
  ],

  "Moxico": [
    "Alto Zambeze",
    "Bundas",
    "Camanongue",
    "Léua",
    "Luacano",
    "Luau",
    "Luchazes",
    "Lumeje",
    "Moxico"
  ],

  "Namibe": [
    "Bibala",
    "Camucuio",
    "Moçâmedes",
    "Tômbwa",
    "Virei"
  ],

  "Uíge": [
    "Alto Cauale",
    "Ambuila",
    "Bembe",
    "Buengas",
    "Bungo",
    "Damba",
    "Maquela do Zombo",
    "Mucaba",
    "Negage",
    "Puri",
    "Quimbele",
    "Quitexe",
    "Sanza Pombo",
    "Songo",
    "Uíge",
    "Zombo"
  ],

  "Zaire": [
    "Cuimba",
    "M'banza Kongo",
    "Nóqui",
    "Nzeto",
    "Soyo",
    "Tomboco"
  ],

  "Icolo e Bengo": [
    "Bom Jesus",
    "Cabiri",
    "Catete",
    "Ícolo",
    "Quiminha"
  ],

  "Moxico Leste": [
    "Cazombo",
    "Lóvua do Zambeze",
    "Cameia"
  ],

  "Cuando": [
    "Dirico",
    "Rivungo",
    "Mavinga"
  ],

  "Cubango": [
    "Menongue",
    "Cuito Cuanavale",
    "Calai",
    "Cuangar"
  ]
}

export const provincias = Object.keys(provinciasMunicipios)

export const getMunicipios = (provincia) =>
  provinciasMunicipios[provincia] || []