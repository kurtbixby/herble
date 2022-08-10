import { sequelize } from '../../config/connection.js';
import { Plant } from '../../models/Plant.js';


const plantData = [
      {
        commonName: 'jade plant',
        scientificName: 'crassula ovata',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/jadePlantFinal/', 
      },
      {
        commonName: "burro's tail",
        scientificName: 'sedum morganianum',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/burrosTailFinal/', 
      },
      {
        commonName: 'crown of thorns',
        scientificName: 'euphorbia milii',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/crownOfThornsFinal/', 
      },
      {
        commonName: 'panda plant',
        scientificName: 'kalanchoe tomentosa',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/pandaPlantFinal/', 
      },
      {
        commonName: "snake plant,mother in law's tongue",
        scientificName: 'dracaena trifasciata',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/snakePlantFinal/', 
      },
      {
        commonName: 'zebra cactus',
        scientificName: 'haworthiopsis attenuata',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/zebraPlantFinal/', 
      },
      {
        commonName: 'christmas cactus',
        scientificName: 'schlumbergera',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/christmasCactusFinal/', 
      },
      {
        commonName: 'easter lily cactus',
        scientificName: 'echinopsis ancistrophora',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/easterLilyCactusFinal/',  
      },
      {
        commonName: "elephants's foot plant",
        scientificName: 'dioscorea elephantipes',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/elephantsFootFinal/', 
      },
      {
        commonName: 'hindu rope plant',
        scientificName: 'hoya carnosa compacta',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/hoyaHinduRopeFinal/', 
      },
      {
        commonName: 'pencil cactus',
        scientificName: 'euphorbia tirucalli',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/pencilCactusFinal/', 
      },
      {
        commonName: 'string of hearts',
        scientificName: 'ceropegia woodii',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/stringOfHeartsFinal/', 
      },
      {
        commonName: 'string of pearls',
        scientificName: 'senecio rowleyanus',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/stringOfPearlsFinal/', 
      },
      {
        commonName: 'dolphin succulent',
        scientificName: 'senecio peregrinus',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/dolphinPlantFinal/', 
      },
      {
        commonName: 'fishbone cactus',
        scientificName: 'epiphyllum anguliger',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/fishboneCactusFinal/', 
      },
      {
        commonName: 'truncate living stone',
        scientificName: 'lithops pseudotruncatella',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/livingStoneFinal/', 
      },
      {
        commonName: 'spiral cactus',
        scientificName: "cereus forbesii 'spiralis'",
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/spiralCactusFinal/', 
      },
      {
        commonName: 'rubber tree',
        scientificName: 'ficus elastica',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/rubberTreeFinal/', 
      },
      {
        
        commonName: 'old lady cactus',
        scientificName: 'mammillaria hahniana',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/oldLadyCactusFinal/', 
      },
      {
        
        commonName: 'umbrella tree',
        scientificName: 'schefflera arboricola',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/umbrellaTreeFinal/', 
      },
      {
        commonName: 'desert rose',
        scientificName: 'adenium obesum',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/desertRoseFinal/', 
      },
      {
        commonName: 'rose,rosa',
        scientificName: 'rosaceae',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/roseFinal/', 
      },
      {
        commonName: 'bougainvillea',
        scientificName: 'bougainvillea glabra',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/bougainvilleaFinal/', 
      },
      {
        commonName: 'gardenia',
        scientificName: 'gardenia jasminoides',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/gardeniaFinal/', 
      },
      {
        commonName: 'hibiscus',
        scientificName: 'hibiscus rosa-sinensis',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/hibiscusFinal/', 
      },
      {
        commonName: 'periwinkle',
        scientificName: 'vinca minor',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/vincaFinal/', 
      },
      {
        commonName: 'rio,rock trumpet',
        scientificName: 'mandevilla',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/rioFinal/', 
      },
      {
        
        commonName: "widow's thrill",
        scientificName: 'kalanchoe',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/widowsThrillFinal/', 
      },
      {
        commonName: 'wax begonia',
        scientificName: 'begonia cucullata',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/waxBegoniaFinal/',
      },
      {
        commonName: 'plumeria,frangipani',
        scientificName: 'plumeria',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/plumeriaFinal/', 
      },
      {
        commonName: 'indian lotus',
        scientificName: 'nelumbo nucifera',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/lotusFinal/', 
      },
      {
        commonName: 'african milk tree',
        scientificName: 'euphorbia trigona ',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/africanMilkTreeFinal/', 
      },
      {
        commonName: 'rattlesnake plant',
        scientificName: 'goeppertia insignis',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/rattlesnakeFinal/', 
      },
      {
        commonName: 'monstera,swiss cheese plant',
        scientificName: 'monstera deliciosa',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/monsteraFinal/', 
      },
      {
        commonName: 'fiddle leaf fig',
        scientificName: 'ficus lyrata',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/fiddleLeafFigFinal/', 
      },
      {
        commonName: 'lucky bamboo',
        scientificName: 'dracaena sanderiana',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/luckyBambooFinal/', 
      },
      {
        commonName: 'peace lily',
        scientificName: 'spathiphyllum',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/peaceLilyFinal/', 
      },
      {
        commonName: 'ponytail palm',
        scientificName: 'beaucarnea recurvata',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/ponytailPalmFinal/', 
      },
      {
        commonName: "devil's ivy,pothos",
        scientificName: 'epipremnum aureum',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/pothosFinal/', 
      },
      {
        
        commonName: 'bromeliad',
        scientificName: 'bromeliaceae',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/bromeliadFinal/', 
      },
      {
        commonName: 'orchid',
        scientificName: 'orchidaceae',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/orchidFinal/', 
      },
      {
        commonName: 'english ivy',
        scientificName: 'hedera helix',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/englishIvyFinal/', 
      },
      {
        commonName: "elephant's ear",
        scientificName: 'colocasia',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/elephantEarsFinal/', 
      },
      {
        commonName: 'prayer plant',
        scientificName: 'maranta leuconeura',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/prayerPlantFinal/', 
      },
      {
        commonName: 'money tree',
        scientificName: 'pachira aquatica',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/moneyTreeFinal/', 
      },
      {
        
        commonName: 'chinese money plant',
        scientificName: 'pilea peperomioides',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/chineseMoneyFinal/', 
      },
      {
        
        commonName: 'madagascar palm',
        scientificName: 'pachypodium lamerei',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/madagascarPalmFinal/', 
      },
      {
        
        commonName: 'staghorn ferns',
        scientificName: 'platycerium',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/staghornFernFinal/', 
      },
      {
        commonName: 'zz plant',
        scientificName: 'zamioculcas',
        url: 'https://herble.s3.us-east-2.amazonaws.com/House+Plants/zzPlantFinal/', 
      },
];

async function seedPlants() {
  await sequelize.sync();
  Plant.bulkCreate(plantData);
}

seedPlants();
