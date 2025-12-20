
import { IeltsCategory } from './types';

// A mix of common sight words, academic vocabulary, and IELTS high-frequency words
export const WORD_LIST = [
  // Basic Sight Words
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  
  // School/Education Context
  "science", "history", "math", "school", "learn", "read", "write", "student", 
  "teacher", "class", "study", "book", "page", "paper", "computer", "keyboard", 
  "exam", "test", "grade", "assignment", "project", "lesson", "library",

  // IELTS / Academic Vocabulary
  "analysis", "approach", "area", "assessment", "assume", "authority", "available", 
  "benefit", "concept", "consistent", "constitutional", "context", "contract", 
  "create", "data", "definition", "derived", "distribution", "economic", 
  "environment", "established", "estimate", "evidence", "export", "factors", 
  "financial", "formula", "function", "identified", "income", "indicate", 
  "individual", "interpretation", "involved", "issues", "labor", "legal", 
  "legislation", "major", "method", "occur", "percent", "period", "policy", 
  "principle", "procedure", "process", "required", "research", "response", 
  "role", "section", "sector", "significant", "similar", "source", "specific", 
  "structure", "theory", "variables", "achieve", "acquisition", "administration",
  "affect", "appropriate", "aspects", "assistance", "categories", "chapter", 
  "commission", "community", "complex", "computer", "conclusion", "conduct", 
  "consequences", "construction", "consumer", "credit", "cultural", "design", 
  "distinction", "elements", "equation", "evaluation", "features", "final", 
  "focus", "impact", "injury", "institute", "invest", "items", "journal", 
  "maintain", "normal", "obtain", "participation", "perceive", "positive", 
  "potential", "previous", "primary", "purchase", "range", "region", 
  "regulations", "relevant", "resident", "resources", "restricted", "security", 
  "sought", "select", "site", "strategies", "survey", "text", "traditional", 
  "transfer",

  // C1/C2 Advanced Vocabulary
  "aberration", "acumen", "admonish", "alacrity", "ambivalent", "ameliorate", 
  "anachronistic", "antithesis", "apocryphal", "ascetic", "assiduous", "beguile", 
  "bellicose", "benevolent", "bilk", "blandishment", "bombastic", "cacophony", 
  "cajole", "calumny", "capricious", "cleave", "cogent", "concomitant", 
  "conflagration", "connive", "construe", "contrite", "cupidity", "dearth", 
  "debacle", "deleterious", "demagogue", "diaphanous", "didactic", "diligent", 
  "disparate", "dissemble", "ebullient", "eclectic", "effrontery", "egregious", 
  "emollient", "empirical", "enervate", "ephemeral", "epistolary", "equanimity", 
  "equivocal", "esoteric", "evanescent", "exacerbate", "exculpate", "execrable", 
  "exigent", "expedient", "extant", "fallacious", "fastidious", "fatuous", 
  "fetter", "flagrant", "florid", "garrulous", "grandiloquence", "gregarious", 
  "hackneyed", "hapless", "harangue", "hegemony", "iconoclast", "idiosyncratic", 
  "ignominious", "impassive", "imperious", "impertinent", "impervious", 
  "impetuous", "impinge", "implacable", "inchoate", "incontrovertible", 
  "indefatigable", "ineffable", "inexorable", "ingenuous", "inimical", 
  "iniquity", "insidious", "intransigent", "inure", "inveterate", "juxtaposition", 
  "knell", "laconic", "largess", "licentious", "limpid", "maudlin", "maverick", 
  "mendacious", "mercurial", "modicum", "multifarious", "myriad", "nadir", 
  "nascent", "nefarious", "neophyte", "obdurate", "obfuscate", "oblique", 
  "obsequious", "obstreperous", "obtuse", "odious", "officious", "onerous", 
  "ostensible", "ostentatious", "palliate", "panacea", "paragon", "pariah", 
  "parsimony", "paucity", "pejorative", "pellucid", "penchant", "perfidy", 
  "perfunctory", "pernicious", "perspicacious", "pertinacious", "phlegmatic", 
  "platitude", "plethora", "polemic", "portent", "precocious", "predilection", 
  "preponderance", "prescient", "probity", "proclivity", "profligate", 
  "promulgate", "propensity", "prosaic", "proscribe", "protean", "prurient", 
  "puerile", "pugnacious", "pulchritude", "punctilious", "quagmire", "quixotic", 
  "rancor", "rebuke", "recalcitrant", "rectitude", "replete", "reprobate", 
  "rescind", "resilient", "rhetoric", "ribald", "rife", "sanctimonious", 
  "sanguine", "scurrilous", "serendipity", "servile", "solicitous", "solipsism", 
  "somnolent", "spurious", "staid", "stolid", "stupefy", "surfeit", "surreptitious", 
  "sycophant", "tacit", "taciturn", "tantamount", "temerity", "tenuous", 
  "timorous", "torpid", "tractable", "transient", "transmute", "trenchant", 
  "truculent", "turgid", "turpitude", "ubiquitous", "umbrage", "unctuous", 
  "upbraid", "usurp", "vacillate", "variegated", "venerate", "veracity", 
  "verdant", "vex", "vicarious", "vicissitude", "vilify", "viscous", "vitriolic", 
  "vituperate", "vociferous", "voracious", "wistful", "zephyr"
];

interface IeltsTask {
  category: IeltsCategory;
  prompt: string;
  image?: string;
  text: string;
}

export const IELTS_DATA: IeltsTask[] = [
  {
    category: 'Opinion',
    prompt: "Some people believe that teaching children at home is best for a child's development while others think that it is important for children to go to school. Discuss the advantages of both methods and give your own opinion.",
    text: "The argument over whether children should be schooled at home or in traditional schools has sparked heated debate. While homeschooling offers a tailored education, I believe that the social environment of a school is more beneficial for a child's overall development. On the one hand, homeschooling allows for a personalized curriculum. Parents can focus on their child's specific interests and pace of learning, ensuring that they fully grasp concepts before moving on. For example, a child who excels in mathematics can advance quickly without being held back by the rest of the class. Furthermore, the home environment is often safer and free from the negative peer pressure or bullying that can occur in schools. This nurturing atmosphere can lead to higher academic achievement and self-confidence. On the other hand, schools provide invaluable social interaction. Children learn to collaborate, resolve conflicts, and interact with peers from diverse backgrounds, which are essential life skills. Moreover, schools offer a wider range of resources, such as science laboratories, sports facilities, and extracurricular clubs, which are difficult to replicate at home. Teachers are also subject specialists, providing a depth of knowledge that parents may not possess. In my opinion, while homeschooling has its merits in terms of academic focus, the holistic development provided by schools is superior. The ability to navigate social hierarchies and build relationships is just as important as academic grades. Therefore, I believe that for the vast majority of children, attending a traditional school is the better option."
  },
  {
    category: 'Discussion',
    prompt: "Computers are being used more and more in education. Some people say that this is a positive trend, while others argue that it is leading to negative consequences. Discuss both sides of this argument and then give your own opinion.",
    text: "There is no doubt that education has evolved significantly with the introduction of computers. While some argue that this over-reliance on technology is detrimental, others believe it revolutionizes the learning process. This essay will discuss both perspectives before concluding that the benefits outweigh the drawbacks. Detractors argue that computers reduce human interaction. In a traditional classroom, the relationship between teacher and student is paramount; however, screens can create a barrier, leading to isolation. Furthermore, there is the issue of reliable information. The internet is flooded with data, not all of it accurate, and students may struggle to discern credible sources from fake news. Additionally, excessive screen time has been linked to physical health issues such as eye strain and a sedentary lifestyle. Conversely, proponents highlight the limitless access to information. Computers allow students to research any topic instantly, breaking down the walls of the classroom. Interactive software can also make learning more engaging for visual learners. For instance, complex scientific processes can be simulated in 3D, making them easier to understand than through textbook diagrams. Moreover, computer literacy is a fundamental skill for the modern workforce, so integrating it early prepares students for their future careers. In conclusion, while there are valid concerns regarding social isolation and health, I believe the integration of computers in education is a positive development. It democratizes information and equips students with essential digital skills. However, it must be managed carefully to ensure a balance between digital and traditional learning methods."
  },
  {
    category: 'Problem Solution',
    prompt: "In many countries, the gap between the rich and the poor is increasing. What problems does this create? What solutions can you suggest?",
    text: "The widening disparity between the wealthy and the impoverished is a significant concern in many nations today. This trend creates social instability and hampers economic growth. However, through progressive taxation and investment in public services, this issue can be mitigated. The primary problem caused by inequality is social unrest. When a large section of the population struggles to meet basic needs while a minority enjoys immense luxury, it breeds resentment. This can lead to increased crime rates as people turn to illegal means to survive, or even civil disorder and protests. Furthermore, economic inequality often leads to unequal opportunities. Children from poor families may lack access to quality education and healthcare, trapping them in a cycle of poverty that is difficult to break, which ultimately wastes the potential of a nation's workforce. To address this, governments must implement progressive taxation systems. By taxing the wealthy at a higher rate, the state can generate revenue to redistribute wealth. This money should be invested heavily in public services, particularly education and healthcare. If high-quality education is free and accessible to all, it levels the playing field, allowing talented individuals from poor backgrounds to succeed. Additionally, minimum wage laws should be reviewed to ensure that all workers earn a living wage, preventing exploitation by large corporations. In summary, the growing gap between rich and poor leads to crime and wasted human potential. By taxing the rich to fund essential public services, governments can create a fairer society where everyone has the opportunity to thrive."
  },
  {
    category: 'Advantages Disadvantages',
    prompt: "In some countries, young people are encouraged to work or travel for a year between finishing high school and starting university studies. Discuss the advantages and disadvantages for young people who decide to do this.",
    text: "Taking a 'gap year' before university is becoming increasingly popular among school leavers. While this break offers profound opportunities for personal growth, it also carries the risk of losing academic momentum. One major advantage is the development of maturity and independence. Young people who travel or work must manage their own finances, solve problems, and interact with adults in the real world. This life experience is often invaluable when they eventually start university, as they are more focused and self-disciplined. Furthermore, it allows students to gain clarity on their career path. A year working in a specific industry might confirm their passion or, conversely, save them from studying a degree they would later regret. However, there are disadvantages. The primary concern is that students may lose the 'study habit'. After a year of freedom, returning to the rigors of academic life, such as attending lectures and writing essays, can be a difficult adjustment. Some students may even decide not to return to education at all, enticed by the immediate income from a job. Additionally, a gap year can be expensive. Travelling requires significant funds, which might place a financial burden on parents if the student cannot support themselves. In conclusion, a gap year can be a transformative experience that builds character and clarify goals. However, it requires careful planning to ensure it is productive and does not derail a student's long-term educational ambitions."
  },
  {
    category: 'Direct Question',
    prompt: "Some people think that money is the best gift to give while others think that money is not a good gift. Discuss both views and give your opinion.",
    text: "Gift-giving is a universal social custom, but the appropriateness of giving cash is often debated. While money offers ultimate flexibility, many argue it lacks the personal touch that defines a true gift. I believe that while money is practical, a thoughtful physical gift is superior for strengthening relationships. Those who favour giving money argue that it prevents waste. We have all received gifts that we do not want or need, which eventually end up in a cupboard or landfill. Cash allows the recipient to buy exactly what they desire, or even put it towards a larger, more meaningful purchase like a holiday or a car. For teenagers or students, who often have little disposable income, money is almost always the most useful present. On the other hand, opponents argue that money is an impersonal 'easy option'. Searching for a gift shows that the giver has spent time thinking about the recipient's personality and tastes. A well-chosen book or a piece of jewellery carries emotional value that a banknote cannot replicate. Giving money can sometimes be interpreted as laziness or a lack of intimacy, suggesting the giver does not know the recipient well enough to choose a present. In my opinion, the purpose of a gift is to bond with the receiver. While money is efficient, it is transactional. A physical gift, even if imperfect, conveys affection and effort. Therefore, unless the recipient is in financial need, I believe a tangible item is a better expression of friendship and love."
  }
];
