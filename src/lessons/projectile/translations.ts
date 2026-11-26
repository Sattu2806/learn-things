/**
 * The film's narration in other languages, for captions in the player and
 * subtitle files for YouTube. Keyed by the English line, so the film script
 * stays the single source; a test checks every line has a translation.
 */

export type Lang = 'en' | 'hi' | 'es';

export const LANGS: { id: Lang; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'हिन्दी' },
  { id: 'es', name: 'Español' },
];

type Table = Record<string, string>;

const hi: Table = {
  'Throw a ball, and it traces a curve.': 'एक गेंद फेंकिए, और वह एक वक्र बनाती है।',
  'Throw it faster, or at another angle, and the curve changes. But it is always the same kind of curve: a parabola.':
    'इसे और तेज़ फेंकिए, या किसी दूसरे कोण पर, तो वक्र बदल जाता है। लेकिन वह हमेशा एक ही तरह का वक्र होता है: परवलय।',
  'Why that shape? Here is the equation that describes it.': 'यही आकार क्यों? यह रहा वह समीकरण जो इसे बताता है।',
  'It can look like a jumble of symbols. But every piece of it is a picture, and by the end you will see each one.':
    'यह चिह्नों का ढेर लग सकता है। लेकिन इसका हर हिस्सा एक चित्र है, और अंत तक आप हर एक को देख लेंगे।',
  'Let us start somewhere simpler. Imagine switching gravity off.': 'चलिए कुछ आसान से शुरू करते हैं। कल्पना कीजिए कि गुरुत्व बंद कर दिया गया है।',
  'Thrown at speed v and angle theta, the ball sets off in a straight line.': 'चाल v और कोण थीटा पर फेंकी गई गेंद एक सीधी रेखा में चल पड़ती है।',
  'Nothing pulls on it, so it never slows down, and it never turns.': 'इसे कुछ नहीं खींचता, इसलिए यह न कभी धीमी होती है, न कभी मुड़ती है।',
  'In every half second, it covers exactly the same distance.': 'हर आधे सेकंड में, यह ठीक उतनी ही दूरी तय करती है।',
  'So its height simply grows with time: the upward part of its speed, v sine theta, multiplied by t.':
    'तो इसकी ऊँचाई समय के साथ बस बढ़ती जाती है: चाल का ऊपर वाला हिस्सा, v साइन थीटा, गुणा t।',
  'Now switch gravity back on, but keep a ghost of the old ball, still sailing along its straight line.':
    'अब गुरुत्व वापस चालू कीजिए, लेकिन पुरानी गेंद की एक परछाईं रखिए, जो अब भी अपनी सीधी रेखा पर चल रही है।',
  'Watch closely. The real ball always stays directly below its ghost.': 'ध्यान से देखिए। असली गेंद हमेशा अपनी परछाईं के ठीक नीचे रहती है।',
  'How far below? Exactly as far as a ball you simply let go of would fall in the same time.': 'कितना नीचे? ठीक उतना, जितना हाथ से छोड़ी गई गेंद उतने ही समय में गिरती।',
  'A dropped ball falls one half g t squared. So that is the gap between the ball and its ghost.':
    'छोड़ी गई गेंद आधा g t स्क्वेयर गिरती है। तो गेंद और उसकी परछाईं के बीच यही दूरी है।',
  'So the height is the straight line height, minus the drop.': 'तो ऊँचाई है सीधी रेखा वाली ऊँचाई, घटा गिरावट।',
  'Here is the drop on its own: a ball let go from rest, with a flash every second.': 'यह रही अकेली गिरावट: विराम से छोड़ी गई एक गेंद, हर सेकंड एक चमक के साथ।',
  'After one second it has fallen one unit. After two seconds, four units. After three, nine. After four, sixteen.':
    'एक सेकंड बाद यह एक इकाई गिर चुकी है। दो सेकंड बाद चार इकाई। तीन के बाद नौ। चार के बाद सोलह।',
  'So in each second it falls one, then three, then five, then seven units. It keeps speeding up, so every second it falls a little further than the last.':
    'तो हर सेकंड में यह एक, फिर तीन, फिर पाँच, फिर सात इकाई गिरती है। यह तेज़ होती जाती है, इसलिए हर सेकंड पिछले से थोड़ा ज़्यादा गिरती है।',
  'And odd numbers always stack up into perfect squares.': 'और विषम संख्याएँ जुड़कर हमेशा पूर्ण वर्ग बनाती हैं।',
  'That square is the t squared in the formula.': 'सूत्र में t स्क्वेयर यही वर्ग है।',
  'Pause and ponder. What if the formula had a plain t here, instead of t squared?': 'रुकिए और सोचिए। अगर सूत्र में यहाँ t स्क्वेयर की जगह सिर्फ़ t होता, तो?',
  'Then the drop would grow by the same amount every second. Nothing would bend the path, and the ball would never come back down.':
    'तब गिरावट हर सेकंड एक जितनी ही बढ़ती। रास्ता कहीं नहीं मुड़ता, और गेंद कभी नीचे नहीं आती।',
  'So when does the ball land? At the moment the drop has grown as big as the rise.': 'तो गेंद ज़मीन पर कब आती है? उस पल, जब गिरावट बढ़कर चढ़ाई के बराबर हो जाती है।',
  'In symbols: the rise equals the drop.': 'चिह्नों में: चढ़ाई बराबर गिरावट।',
  'Cancel one t from each side,': 'दोनों तरफ़ से एक t काट दीजिए,',
  'and out drops the time in the air.': 'और हवा में रहने का समय निकल आता है।',
  'The distance is the sideways speed, v cosine theta, times that time.': 'दूरी है क्षैतिज चाल, v कोसाइन थीटा, गुणा वह समय।',
  'Put in that time, and two sine theta cosine theta folds neatly into sine two theta.': 'वह समय रखिए, और दो साइन थीटा कोसाइन थीटा सिमटकर साइन दो थीटा बन जाता है।',
  'Sine two theta is largest at forty five degrees, so that is the angle that throws farthest. And thirty and sixty land in exactly the same spot.':
    'साइन दो थीटा पैंतालीस डिग्री पर सबसे बड़ा होता है, इसलिए वही कोण सबसे दूर फेंकता है। और तीस और साठ ठीक एक ही जगह गिरते हैं।',
  'So a thrown ball is really two simple things at once.': 'तो फेंकी गई गेंद असल में एक साथ दो सरल चीज़ें है।',
  'A straight line, where it would go if nothing pulled on it. And a drop below that line that grows like t squared.':
    'एक सीधी रेखा, जहाँ वह जाती अगर उसे कुछ न खींचता। और उस रेखा के नीचे एक गिरावट, जो t स्क्वेयर की तरह बढ़ती है।',
  'Every parabola you have ever seen is exactly that, and nothing more.': 'आपने जो भी परवलय देखा है, वह ठीक यही है, इससे ज़्यादा कुछ नहीं।',
  'Change the speed and the angle.': 'चाल और कोण बदलिए।',
  'Try the Moon or Mars by changing g.': 'g बदलकर चाँद या मंगल आज़माइए।',
  'What changes with t instead of t squared?': 't स्क्वेयर की जगह t से क्या बदलता है?',
  'Find the angle that lands farthest.': 'वह कोण खोजिए जो सबसे दूर गिरता है।',
  'Pause and ponder': 'रुकिए और सोचिए',
};

const es: Table = {
  'Throw a ball, and it traces a curve.': 'Lanza una pelota y dibuja una curva.',
  'Throw it faster, or at another angle, and the curve changes. But it is always the same kind of curve: a parabola.':
    'Lánzala más rápido, o con otro ángulo, y la curva cambia. Pero siempre es el mismo tipo de curva: una parábola.',
  'Why that shape? Here is the equation that describes it.': '¿Por qué esa forma? Esta es la ecuación que la describe.',
  'It can look like a jumble of symbols. But every piece of it is a picture, and by the end you will see each one.':
    'Puede parecer un lío de símbolos. Pero cada parte es un dibujo, y al final los verás todos.',
  'Let us start somewhere simpler. Imagine switching gravity off.': 'Empecemos por algo más simple. Imagina que apagamos la gravedad.',
  'Thrown at speed v and angle theta, the ball sets off in a straight line.': 'Lanzada con rapidez v y ángulo theta, la pelota sale en línea recta.',
  'Nothing pulls on it, so it never slows down, and it never turns.': 'Nada tira de ella, así que nunca frena y nunca gira.',
  'In every half second, it covers exactly the same distance.': 'En cada medio segundo recorre exactamente la misma distancia.',
  'So its height simply grows with time: the upward part of its speed, v sine theta, multiplied by t.':
    'Así que su altura simplemente crece con el tiempo: la parte vertical de su rapidez, v seno de theta, por t.',
  'Now switch gravity back on, but keep a ghost of the old ball, still sailing along its straight line.':
    'Ahora vuelve a encender la gravedad, pero deja un fantasma de la pelota anterior, que sigue su línea recta.',
  'Watch closely. The real ball always stays directly below its ghost.': 'Mira con atención. La pelota real siempre está justo debajo de su fantasma.',
  'How far below? Exactly as far as a ball you simply let go of would fall in the same time.': '¿Cuánto más abajo? Exactamente lo que caería en el mismo tiempo una pelota que simplemente sueltas.',
  'A dropped ball falls one half g t squared. So that is the gap between the ball and its ghost.':
    'Una pelota que se suelta cae un medio de g t al cuadrado. Esa es la distancia entre la pelota y su fantasma.',
  'So the height is the straight line height, minus the drop.': 'Así que la altura es la altura de la línea recta, menos la caída.',
  'Here is the drop on its own: a ball let go from rest, with a flash every second.': 'Aquí está la caída sola: una pelota que se suelta desde el reposo, con un destello cada segundo.',
  'After one second it has fallen one unit. After two seconds, four units. After three, nine. After four, sixteen.':
    'Tras un segundo ha caído una unidad. Tras dos segundos, cuatro. Tras tres, nueve. Tras cuatro, dieciséis.',
  'So in each second it falls one, then three, then five, then seven units. It keeps speeding up, so every second it falls a little further than the last.':
    'Así que en cada segundo cae una, luego tres, luego cinco, luego siete unidades. Va cada vez más rápido, así que cada segundo cae un poco más que el anterior.',
  'And odd numbers always stack up into perfect squares.': 'Y los números impares siempre se apilan formando cuadrados perfectos.',
  'That square is the t squared in the formula.': 'Ese cuadrado es la t al cuadrado de la fórmula.',
  'Pause and ponder. What if the formula had a plain t here, instead of t squared?': 'Pausa y piensa. ¿Y si la fórmula tuviera aquí una t sola, en lugar de t al cuadrado?',
  'Then the drop would grow by the same amount every second. Nothing would bend the path, and the ball would never come back down.':
    'Entonces la caída crecería lo mismo cada segundo. Nada curvaría la trayectoria, y la pelota nunca volvería a bajar.',
  'So when does the ball land? At the moment the drop has grown as big as the rise.': '¿Cuándo cae la pelota al suelo? En el momento en que la caída ha crecido tanto como la subida.',
  'In symbols: the rise equals the drop.': 'En símbolos: la subida es igual a la caída.',
  'Cancel one t from each side,': 'Cancela una t de cada lado,',
  'and out drops the time in the air.': 'y aparece el tiempo de vuelo.',
  'The distance is the sideways speed, v cosine theta, times that time.': 'La distancia es la rapidez horizontal, v coseno de theta, por ese tiempo.',
  'Put in that time, and two sine theta cosine theta folds neatly into sine two theta.': 'Sustituye ese tiempo, y dos seno de theta coseno de theta se convierte en seno de dos theta.',
  'Sine two theta is largest at forty five degrees, so that is the angle that throws farthest. And thirty and sixty land in exactly the same spot.':
    'Seno de dos theta es máximo a cuarenta y cinco grados, así que ese es el ángulo que lanza más lejos. Y treinta y sesenta caen exactamente en el mismo punto.',
  'So a thrown ball is really two simple things at once.': 'Así que una pelota lanzada es en realidad dos cosas simples a la vez.',
  'A straight line, where it would go if nothing pulled on it. And a drop below that line that grows like t squared.':
    'Una línea recta, adonde iría si nada tirara de ella. Y una caída bajo esa línea que crece como t al cuadrado.',
  'Every parabola you have ever seen is exactly that, and nothing more.': 'Cada parábola que has visto es exactamente eso, y nada más.',
  'Change the speed and the angle.': 'Cambia la rapidez y el ángulo.',
  'Try the Moon or Mars by changing g.': 'Prueba la Luna o Marte cambiando g.',
  'What changes with t instead of t squared?': '¿Qué cambia con t en lugar de t al cuadrado?',
  'Find the angle that lands farthest.': 'Encuentra el ángulo que llega más lejos.',
  'Pause and ponder': 'Pausa y piensa',
};

const TABLES: Record<Exclude<Lang, 'en'>, Table> = { hi, es };

/** The line in the chosen language (English if there is no translation). */
export function translate(text: string, lang: Lang): string {
  if (lang === 'en') return text;
  return TABLES[lang][text] ?? text;
}

export function translator(lang: Lang) {
  return (text: string) => translate(text, lang);
}

export function missing(lines: string[], lang: Exclude<Lang, 'en'>) {
  return lines.filter((l) => !(l in TABLES[lang]));
}
