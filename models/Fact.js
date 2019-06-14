/*    
      {fact:"In 1932 Brazil didn't have enough funds to send its athletes to the Olympics, so the athletes had to earn the money themselves by selling coffee.", source:"BoredPanda"},
      {fact:"Before people learned how to brew coffee, east African tribes mixed coffee berries with animal fat and consumed it as food.", source:"BoredPanda"},
      {fact:"There's two main categories of coffee: Robusta and Arabica. Robusta coffee has a more acidic and harsh flavor with a higher level of caffeine. Arabica is known for its delicate flavor and lower acidity.", source:"BoredPanda"},
      {fact:"Globally people consume about 2.25 billion cups of coffee every day.", source:"BoredPanda"},
      {fact:"Coffee stays warmer about 20% longer when you add cream.", source:"BoredPanda"},
      {fact:"Coffee is most effective if you drink it between 9:30 and 11:30 AM.", source:"BoredPanda"},
      {fact:"Studies have shown that drinking coffee may lower your risk of depression.", source:"BoredPanda"},
      {fact:"Contrary to the popular belief, dark roast and light roast coffee actually have a similar amount of caffeine.", source:"BoredPanda"},
      {fact:"The average barista's age in Italy is 48 years old.", source:"BoredPanda"},
      {fact:"There's more caffeine in an average cup of drip coffee than in espresso.", source:"BoredPanda"},
      {fact:"It is estimated that roughly 80 to 100 cups of coffee would be a lethal dose for an average adult.", source:"BoredPanda"},
      {fact:"The most expensive coffee in world is Black Ivory Coffee. It can cost up to $1,100 per kilogram. This coffee is produced from part-digested coffee cherries eaten and defecated by Thai elephants.", source:"BoredPanda"},
      {fact:"Decaf coffee is not completely caffeine-free. The decaffeination process usually removes 94-98 percent of caffeine. Studies have shown that while the average 16-ounce caffeinated coffee has 188 ml of caffeine, the average 16-ounce decaf has 9.4ml.", source:"BoredPanda"},
      {fact:"Just the smell of coffee can help you wake you up in the morning.", source:"BoredPanda"},
      {fact:"North Korea holds the record for the largest iced coffee. The cup contained 14,228.1 litres of iced Americano coffee.", source:"BoredPanda"},
      {fact:"Around 54% of Americans over the age of 18 drink coffee every day.", source:"BoredPanda"},
      {fact:"The word 'coffee' comes from the Arabic word 'qahwah' which refers to a type of wine.", source:"BoredPanda"},
      {fact:"Americans consume 400 million cups of coffee per day.", source:"BoredPanda"},
      {fact:"The average American spends around $20 a week on coffee, which is $1.092 per year.", source:"BoredPanda"},
      {fact:"You can overdose on coffee, but don't worry, you would need to drink about 30 cups in a very short period time to get close to a lethal dose of caffeine. ", source:"GoodHouseKeeping"},
      {fact:"After coffee beans are decaffeinated, several coffee manufacturers sell the caffeine to soda and pharmaceutical companies.", source:"MentalFloss"},
      {fact:"Beethoven enjoyed a cup of coffee, and was extremely particular about its preparation; he insisted that each cup he consumed be made with exactly 60 beans.", source:"MentalFloss"},
      {fact:"In 1674, the Women's Petition Against Coffee claimed the beverage was turning British men into 'useless corpses' and proposed a ban on it for anyone under the age of 60.", source:"MentalFloss"},
      {fact:"Coffee was banned in Mecca in 1511. It was believed to stimulate radical thinking and idleness.", source:"Agiboo"},
      {fact:"In ancient Arab culture, a woman could only divorce her husband if he didn’t like her coffee.", source:"Agiboo"},
      {fact:"The “Big Four” coffee roasting companies – Kraft, P&G, Sara Lee and Nestle – buy about 50% of the coffee produced worldwide.", source:"Agiboo"}
      */
const mongoose     = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

let Schema = mongoose.Schema;
let factSchema = new Schema({
  factText: {type: String, required: true},
  source: {type: String, required: true},
});

//Glitch is giving errors in the next line but is working as it should!
module.exports = Fact = mongoose.model('Fact', factSchema);









