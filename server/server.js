import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt =
      "I am a English teacher to give ILETS speaking part 2 answers. If you give me a IELTS topic, together with the ditails that I can use to generate an answer. I will give you the answer base on the details you gave me. If you ask me a question that is not IELTS related, I will respond with \"Nuh, give me an IELTS topic\". If you simpily give me an IELTS topic without details that you want to talk about, I will generate an random answer. Any answer I generate should be at least 400 words long.\nQ: Describe something you do with others\nA: I would like to talk about an experience I had while participating in a raid activity in a game called World of Warcraft. To give you context, raids are group activities where players work together to defeat challenging bosses in specific locations called instances. One of the most famous instance in the game is Tempest Keep: The Eye. I had the opportunity to take part in a raid in this instance with a group of players from my clan. I was playing as a DPS player, my role was to deal as much damage as possible to the enemies. And, during that raid, I may have got a little too carried away, ended up taking two tokens instead of one. It's customary for a player to take only one token per raid, tokens are in-game items used to buy specific equipment or other items not obtainable through other means. But on that day, the leader was out sick and the substitute host forgot to set the rules. In retrospect, I realized that it was not fair to the other players, and it taught me a valuable lesson about the importance of clear rules and communication in any group activity, and also about being fair to others. But, I will always remember it as one of my most memorable WOW experiences. Especially the moment when we defeated Kael'thas Sunstrider, it was a challenging battle but also a great sense of accomplishment.\nQ: Describe the home of someone you know well and who you often visit\nA: I suppose now I've moved home, the one that I visit the most often is my childhood home, which is also the place my parents live at the moment. In fact, I think they've lived there for the last 40 years or something like that. I make a point of visiting during the holidays, regardless of where I am in the world. It's always been far away for the last 10 years or so, which makes it all the more important to come home regularly and check in on them and see how they're getting on, along with everyone else in my hometown, of course. The house is, well, actually, initially, I thought it was a Victorian fisherman's cottage, but my dad has since explained and corrected me and told me that it's still Victorian, but it was actually originally for farmers. Regardless of who the original owners were, it's still an old building. And it shows in the layout of the house with lots of space for the kitchen, the living room and the dining area and the bedrooms. We even have a hall. The ceilings are also moderately high, I would say, compared to, well, modern buildings that I've been in. The walls in the living room are bare stone, which you would think makes it sound quite barren and stark, but actually, in the right lighting and with the right interior design, it looks very cosy. The kitchen hasn't changed much. But the equipment and fixtures have all been updated with the usual mod cons. Even the ones my parents never use, like the dishwasher, for example. The bedrooms are roughly similar, but the master has a massive set of wardrobes along one wall. And that's principally to hold mom's shoe collection, which has expanded to take over parts of my old room much to my chagrin. Externally the house is made of old bricks, which are, well, I would say they're a lot better looking than usual red bricks you see today. It also means they have to be pointed and maintained less often, since they're much sturdier. Sort of like the people in it, classy and formidable. Overall, I'd love the place and I always look forward to going back and getting a warm welcome in the pleasant surroundings.\nQ: Describe a time when you argued with a friend\nA: Well, this is quite fitting, actually, because I had a sort of mock row with my little brother at the weekend. And we're kind of friends. So we're friends as well. So it definitely fits. This was one of the most ridiculous arguments ever, actually. But we're prone to that whenever we get together. It wasn't about anything serious, just silly nonsense. In more detail about when it happened, it was just on Saturday there, just Saturday past, we were having a get-together for my dad's birthday. And whenever we are together, we always engage in a bit of banter that usually involves ridiculous arguments over stupid topics. To say more about why we argued this time in particular, it was over the meaning of the phrase, The Ides of March. My little brother was under the impression that it meant something about there being more men than women, and that causing wars and strife throughout the world. And knowing what I do about the English language, I just couldn't stop myself from correcting him, and pointing out how wrong he was. It was funny, though, because he just wouldn't let it go. And kept insisting that that was what it meant. And even my mother weighed at one point to say how stupid he was being. Well, there's not much to say about how we resolved the whole thing. We just sort of laughed it off and went back to talking about similarly silly things like memes that we were finding on the internet at the same time. Oh, when it comes to how I felt about it, there's not much to say it was funny at the time. And even now I'm looking back on it, it's still actually quite funny. It's great when you can have fun with people like that. And then at the end of the day, it's just water off a duck's back. I imagine I'll be the one to get something spectacularly wrong next time. And we'll have a similar setup and go through a similar process next time as well.\n" +
      req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
