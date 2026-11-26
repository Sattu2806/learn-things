/**
 * The film's narration in other languages, for captions in the player and
 * subtitle files for YouTube. Keyed by the English line, so the film script
 * stays the single source; a test checks every line has a translation.
 */

export type Lang = 'en' | 'hi' | 'es' | 'pt' | 'fr' | 'ar' | 'id';

export const LANGS: { id: Lang; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'हिन्दी' },
  { id: 'es', name: 'Español' },
  { id: 'pt', name: 'Português' },
  { id: 'fr', name: 'Français' },
  { id: 'ar', name: 'العربية' },
  { id: 'id', name: 'Bahasa Indonesia' },
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

const pt: Table = {
  'Throw a ball, and it traces a curve.': 'Lance uma bola e ela desenha uma curva.',
  'Throw it faster, or at another angle, and the curve changes. But it is always the same kind of curve: a parabola.':
    'Lance-a mais rápido, ou em outro ângulo, e a curva muda. Mas é sempre o mesmo tipo de curva: uma parábola.',
  'Why that shape? Here is the equation that describes it.': 'Por que essa forma? Aqui está a equação que a descreve.',
  'It can look like a jumble of symbols. But every piece of it is a picture, and by the end you will see each one.':
    'Pode parecer uma confusão de símbolos. Mas cada parte dela é uma imagem, e no final você vai enxergar todas.',
  'Let us start somewhere simpler. Imagine switching gravity off.': 'Vamos começar por algo mais simples. Imagine desligar a gravidade.',
  'Thrown at speed v and angle theta, the ball sets off in a straight line.': 'Lançada com velocidade v e ângulo theta, a bola parte em linha reta.',
  'Nothing pulls on it, so it never slows down, and it never turns.': 'Nada a puxa, então ela nunca desacelera e nunca desvia.',
  'In every half second, it covers exactly the same distance.': 'A cada meio segundo, ela percorre exatamente a mesma distância.',
  'So its height simply grows with time: the upward part of its speed, v sine theta, multiplied by t.':
    'Assim, sua altura simplesmente cresce com o tempo: a parte vertical da velocidade, v seno de theta, vezes t.',
  'Now switch gravity back on, but keep a ghost of the old ball, still sailing along its straight line.':
    'Agora ligue a gravidade de novo, mas mantenha um fantasma da bola antiga, ainda seguindo sua linha reta.',
  'Watch closely. The real ball always stays directly below its ghost.': 'Observe bem. A bola real fica sempre exatamente abaixo do seu fantasma.',
  'How far below? Exactly as far as a ball you simply let go of would fall in the same time.': 'Quanto abaixo? Exatamente o quanto uma bola que você simplesmente solta cairia no mesmo tempo.',
  'A dropped ball falls one half g t squared. So that is the gap between the ball and its ghost.':
    'Uma bola solta cai um meio g t ao quadrado. Essa é a distância entre a bola e o seu fantasma.',
  'So the height is the straight line height, minus the drop.': 'Então a altura é a altura da linha reta, menos a queda.',
  'Here is the drop on its own: a ball let go from rest, with a flash every second.': 'Aqui está a queda sozinha: uma bola solta do repouso, com um clarão a cada segundo.',
  'After one second it has fallen one unit. After two seconds, four units. After three, nine. After four, sixteen.':
    'Depois de um segundo, ela caiu uma unidade. Depois de dois segundos, quatro. Depois de três, nove. Depois de quatro, dezesseis.',
  'So in each second it falls one, then three, then five, then seven units. It keeps speeding up, so every second it falls a little further than the last.':
    'Assim, em cada segundo ela cai uma, depois três, depois cinco, depois sete unidades. Ela vai ficando mais rápida, então a cada segundo cai um pouco mais que no anterior.',
  'And odd numbers always stack up into perfect squares.': 'E os números ímpares sempre se somam formando quadrados perfeitos.',
  'That square is the t squared in the formula.': 'Esse quadrado é o t ao quadrado da fórmula.',
  'Pause and ponder. What if the formula had a plain t here, instead of t squared?': 'Pare e reflita. E se a fórmula tivesse aqui um t simples, em vez de t ao quadrado?',
  'Then the drop would grow by the same amount every second. Nothing would bend the path, and the ball would never come back down.':
    'Então a queda aumentaria a mesma quantidade a cada segundo. Nada curvaria a trajetória, e a bola nunca voltaria a descer.',
  'So when does the ball land? At the moment the drop has grown as big as the rise.': 'Então quando a bola chega ao chão? No momento em que a queda se torna tão grande quanto a subida.',
  'In symbols: the rise equals the drop.': 'Em símbolos: a subida é igual à queda.',
  'Cancel one t from each side,': 'Cancele um t de cada lado,',
  'and out drops the time in the air.': 'e surge o tempo no ar.',
  'The distance is the sideways speed, v cosine theta, times that time.': 'A distância é a velocidade horizontal, v cosseno de theta, vezes esse tempo.',
  'Put in that time, and two sine theta cosine theta folds neatly into sine two theta.': 'Substitua esse tempo, e dois seno de theta cosseno de theta se resume em seno de dois theta.',
  'Sine two theta is largest at forty five degrees, so that is the angle that throws farthest. And thirty and sixty land in exactly the same spot.':
    'Seno de dois theta é máximo em quarenta e cinco graus, então esse é o ângulo que lança mais longe. E trinta e sessenta caem exatamente no mesmo ponto.',
  'So a thrown ball is really two simple things at once.': 'Então uma bola lançada é, na verdade, duas coisas simples ao mesmo tempo.',
  'A straight line, where it would go if nothing pulled on it. And a drop below that line that grows like t squared.':
    'Uma linha reta, para onde ela iria se nada a puxasse. E uma queda abaixo dessa linha que cresce como t ao quadrado.',
  'Every parabola you have ever seen is exactly that, and nothing more.': 'Toda parábola que você já viu é exatamente isso, e nada mais.',
  'Change the speed and the angle.': 'Mude a velocidade e o ângulo.',
  'Try the Moon or Mars by changing g.': 'Experimente a Lua ou Marte mudando g.',
  'What changes with t instead of t squared?': 'O que muda com t em vez de t ao quadrado?',
  'Find the angle that lands farthest.': 'Encontre o ângulo que chega mais longe.',
  'Pause and ponder': 'Pare e reflita',
};

const fr: Table = {
  'Throw a ball, and it traces a curve.': 'Lancez une balle, et elle trace une courbe.',
  'Throw it faster, or at another angle, and the curve changes. But it is always the same kind of curve: a parabola.':
    'Lancez-la plus vite, ou sous un autre angle, et la courbe change. Mais c’est toujours le même type de courbe : une parabole.',
  'Why that shape? Here is the equation that describes it.': 'Pourquoi cette forme ? Voici l’équation qui la décrit.',
  'It can look like a jumble of symbols. But every piece of it is a picture, and by the end you will see each one.':
    'On dirait un fouillis de symboles. Mais chaque morceau est une image, et à la fin vous les verrez tous.',
  'Let us start somewhere simpler. Imagine switching gravity off.': 'Commençons par quelque chose de plus simple. Imaginez que l’on coupe la pesanteur.',
  'Thrown at speed v and angle theta, the ball sets off in a straight line.': 'Lancée à la vitesse v sous l’angle thêta, la balle part en ligne droite.',
  'Nothing pulls on it, so it never slows down, and it never turns.': 'Rien ne la tire, donc elle ne ralentit jamais et ne dévie jamais.',
  'In every half second, it covers exactly the same distance.': 'Chaque demi-seconde, elle parcourt exactement la même distance.',
  'So its height simply grows with time: the upward part of its speed, v sine theta, multiplied by t.':
    'Sa hauteur croît donc simplement avec le temps : la composante verticale de sa vitesse, v sinus thêta, multipliée par t.',
  'Now switch gravity back on, but keep a ghost of the old ball, still sailing along its straight line.':
    'Rétablissez maintenant la pesanteur, mais gardez un fantôme de l’ancienne balle, qui suit toujours sa ligne droite.',
  'Watch closely. The real ball always stays directly below its ghost.': 'Regardez bien. La vraie balle reste toujours juste en dessous de son fantôme.',
  'How far below? Exactly as far as a ball you simply let go of would fall in the same time.': 'À quelle distance en dessous ? Exactement autant qu’une balle que l’on lâche simplement tomberait dans le même temps.',
  'A dropped ball falls one half g t squared. So that is the gap between the ball and its ghost.':
    'Une balle lâchée tombe de un demi g t au carré. C’est donc l’écart entre la balle et son fantôme.',
  'So the height is the straight line height, minus the drop.': 'La hauteur est donc la hauteur sur la droite, moins la chute.',
  'Here is the drop on its own: a ball let go from rest, with a flash every second.': 'Voici la chute seule : une balle lâchée sans vitesse initiale, avec un éclair chaque seconde.',
  'After one second it has fallen one unit. After two seconds, four units. After three, nine. After four, sixteen.':
    'Après une seconde, elle est tombée d’une unité. Après deux secondes, de quatre. Après trois, de neuf. Après quatre, de seize.',
  'So in each second it falls one, then three, then five, then seven units. It keeps speeding up, so every second it falls a little further than the last.':
    'Ainsi, à chaque seconde elle tombe d’une, puis de trois, puis de cinq, puis de sept unités. Elle accélère sans cesse, donc chaque seconde elle tombe un peu plus que la précédente.',
  'And odd numbers always stack up into perfect squares.': 'Et les nombres impairs s’additionnent toujours en carrés parfaits.',
  'That square is the t squared in the formula.': 'Ce carré, c’est le t au carré de la formule.',
  'Pause and ponder. What if the formula had a plain t here, instead of t squared?': 'Pause et réflexion. Et si la formule avait ici un simple t, au lieu de t au carré ?',
  'Then the drop would grow by the same amount every second. Nothing would bend the path, and the ball would never come back down.':
    'Alors la chute augmenterait de la même quantité chaque seconde. Rien ne courberait la trajectoire, et la balle ne redescendrait jamais.',
  'So when does the ball land? At the moment the drop has grown as big as the rise.': 'Alors quand la balle retombe-t-elle ? Au moment où la chute est devenue aussi grande que la montée.',
  'In symbols: the rise equals the drop.': 'En symboles : la montée est égale à la chute.',
  'Cancel one t from each side,': 'Simplifiez un t de chaque côté,',
  'and out drops the time in the air.': 'et le temps passé en l’air apparaît.',
  'The distance is the sideways speed, v cosine theta, times that time.': 'La distance est la vitesse horizontale, v cosinus thêta, multipliée par ce temps.',
  'Put in that time, and two sine theta cosine theta folds neatly into sine two theta.': 'Remplacez ce temps, et deux sinus thêta cosinus thêta se condense en sinus deux thêta.',
  'Sine two theta is largest at forty five degrees, so that is the angle that throws farthest. And thirty and sixty land in exactly the same spot.':
    'Sinus deux thêta est maximal à quarante-cinq degrés, c’est donc l’angle qui lance le plus loin. Et trente et soixante retombent exactement au même endroit.',
  'So a thrown ball is really two simple things at once.': 'Une balle lancée, ce sont donc en réalité deux choses simples à la fois.',
  'A straight line, where it would go if nothing pulled on it. And a drop below that line that grows like t squared.':
    'Une ligne droite, là où elle irait si rien ne la tirait. Et une chute sous cette droite qui croît comme t au carré.',
  'Every parabola you have ever seen is exactly that, and nothing more.': 'Toutes les paraboles que vous avez vues sont exactement cela, et rien de plus.',
  'Change the speed and the angle.': 'Changez la vitesse et l’angle.',
  'Try the Moon or Mars by changing g.': 'Essayez la Lune ou Mars en changeant g.',
  'What changes with t instead of t squared?': 'Qu’est-ce qui change avec t au lieu de t au carré ?',
  'Find the angle that lands farthest.': 'Trouvez l’angle qui porte le plus loin.',
  'Pause and ponder': 'Pause et réflexion',
};

const ar: Table = {
  'Throw a ball, and it traces a curve.': 'اقذف كرة، فترسم منحنى.',
  'Throw it faster, or at another angle, and the curve changes. But it is always the same kind of curve: a parabola.':
    'اقذفها بسرعة أكبر، أو بزاوية أخرى، فيتغير المنحنى. لكنه دائمًا من النوع نفسه: قطع مكافئ.',
  'Why that shape? Here is the equation that describes it.': 'لماذا هذا الشكل؟ إليك المعادلة التي تصفه.',
  'It can look like a jumble of symbols. But every piece of it is a picture, and by the end you will see each one.':
    'قد تبدو كخليط من الرموز. لكن كل جزء منها صورة، وفي النهاية سترى كل واحد منها.',
  'Let us start somewhere simpler. Imagine switching gravity off.': 'لنبدأ بشيء أبسط. تخيّل أننا أوقفنا الجاذبية.',
  'Thrown at speed v and angle theta, the ball sets off in a straight line.': 'تُقذف الكرة بسرعة v وبزاوية ثيتا، فتنطلق في خط مستقيم.',
  'Nothing pulls on it, so it never slows down, and it never turns.': 'لا شيء يجذبها، لذلك لا تبطئ أبدًا ولا تنحرف أبدًا.',
  'In every half second, it covers exactly the same distance.': 'في كل نصف ثانية تقطع المسافة نفسها تمامًا.',
  'So its height simply grows with time: the upward part of its speed, v sine theta, multiplied by t.':
    'إذًا ارتفاعها ببساطة يزداد مع الزمن: المركبة الرأسية لسرعتها، v جيب ثيتا، مضروبة في t.',
  'Now switch gravity back on, but keep a ghost of the old ball, still sailing along its straight line.':
    'الآن أعد تشغيل الجاذبية، لكن أبقِ شبحًا للكرة القديمة، ما زالت تسير على خطها المستقيم.',
  'Watch closely. The real ball always stays directly below its ghost.': 'انظر جيدًا. الكرة الحقيقية تبقى دائمًا تحت شبحها مباشرة.',
  'How far below? Exactly as far as a ball you simply let go of would fall in the same time.': 'كم تحته؟ بالضبط بقدر ما تسقط كرة تتركها ببساطة في الزمن نفسه.',
  'A dropped ball falls one half g t squared. So that is the gap between the ball and its ghost.':
    'الكرة المتروكة تسقط نصف g ضرب t تربيع. وهذه هي المسافة بين الكرة وشبحها.',
  'So the height is the straight line height, minus the drop.': 'إذًا الارتفاع هو ارتفاع الخط المستقيم، ناقص السقوط.',
  'Here is the drop on its own: a ball let go from rest, with a flash every second.': 'إليك السقوط وحده: كرة تُترك من السكون، مع وميض كل ثانية.',
  'After one second it has fallen one unit. After two seconds, four units. After three, nine. After four, sixteen.':
    'بعد ثانية واحدة تكون قد سقطت وحدة واحدة. بعد ثانيتين، أربع وحدات. بعد ثلاث، تسع. بعد أربع، ست عشرة.',
  'So in each second it falls one, then three, then five, then seven units. It keeps speeding up, so every second it falls a little further than the last.':
    'إذًا في كل ثانية تسقط واحدة، ثم ثلاثًا، ثم خمسًا، ثم سبع وحدات. فهي تزداد سرعة باستمرار، لذلك تسقط في كل ثانية أكثر قليلًا من التي قبلها.',
  'And odd numbers always stack up into perfect squares.': 'والأعداد الفردية تتراكم دائمًا لتشكّل مربعات كاملة.',
  'That square is the t squared in the formula.': 'هذا المربع هو t تربيع في القانون.',
  'Pause and ponder. What if the formula had a plain t here, instead of t squared?': 'توقف وفكّر. ماذا لو كان في القانون هنا t فقط، بدل t تربيع؟',
  'Then the drop would grow by the same amount every second. Nothing would bend the path, and the ball would never come back down.':
    'عندها سيزداد السقوط بالمقدار نفسه كل ثانية. لن ينحني المسار، ولن تعود الكرة إلى الأسفل أبدًا.',
  'So when does the ball land? At the moment the drop has grown as big as the rise.': 'فمتى تصل الكرة إلى الأرض؟ في اللحظة التي يصبح فيها السقوط بقدر الصعود.',
  'In symbols: the rise equals the drop.': 'بالرموز: الصعود يساوي السقوط.',
  'Cancel one t from each side,': 'اختصر t واحدة من كل طرف،',
  'and out drops the time in the air.': 'فيظهر زمن بقائها في الهواء.',
  'The distance is the sideways speed, v cosine theta, times that time.': 'المسافة هي السرعة الأفقية، v جيب تمام ثيتا، مضروبة في ذلك الزمن.',
  'Put in that time, and two sine theta cosine theta folds neatly into sine two theta.': 'عوّض بذلك الزمن، فيتحول اثنان جيب ثيتا جيب تمام ثيتا بسلاسة إلى جيب اثنين ثيتا.',
  'Sine two theta is largest at forty five degrees, so that is the angle that throws farthest. And thirty and sixty land in exactly the same spot.':
    'جيب اثنين ثيتا أكبر ما يكون عند خمس وأربعين درجة، لذلك هذه هي الزاوية التي تقذف إلى أبعد مسافة. وثلاثون وستون تسقطان في الموضع نفسه تمامًا.',
  'So a thrown ball is really two simple things at once.': 'إذًا الكرة المقذوفة هي في الحقيقة شيئان بسيطان معًا.',
  'A straight line, where it would go if nothing pulled on it. And a drop below that line that grows like t squared.':
    'خط مستقيم، حيث كانت ستذهب لو لم يجذبها شيء. وسقوط تحت ذلك الخط يزداد مثل t تربيع.',
  'Every parabola you have ever seen is exactly that, and nothing more.': 'كل قطع مكافئ رأيته في حياتك هو هذا تمامًا، لا أكثر.',
  'Change the speed and the angle.': 'غيّر السرعة والزاوية.',
  'Try the Moon or Mars by changing g.': 'جرّب القمر أو المريخ بتغيير g.',
  'What changes with t instead of t squared?': 'ماذا يتغير مع t بدل t تربيع؟',
  'Find the angle that lands farthest.': 'جد الزاوية التي تصل إلى أبعد مسافة.',
  'Pause and ponder': 'توقف وفكّر',
};

const id: Table = {
  'Throw a ball, and it traces a curve.': 'Lempar sebuah bola, dan bola itu membentuk lengkungan.',
  'Throw it faster, or at another angle, and the curve changes. But it is always the same kind of curve: a parabola.':
    'Lempar lebih cepat, atau dengan sudut lain, dan lengkungannya berubah. Tetapi selalu jenis lengkungan yang sama: parabola.',
  'Why that shape? Here is the equation that describes it.': 'Mengapa bentuknya begitu? Inilah persamaan yang menggambarkannya.',
  'It can look like a jumble of symbols. But every piece of it is a picture, and by the end you will see each one.':
    'Kelihatannya seperti tumpukan simbol. Tetapi setiap bagiannya adalah sebuah gambar, dan di akhir kamu akan melihat semuanya.',
  'Let us start somewhere simpler. Imagine switching gravity off.': 'Mari mulai dari yang lebih sederhana. Bayangkan gravitasi dimatikan.',
  'Thrown at speed v and angle theta, the ball sets off in a straight line.': 'Dilempar dengan kecepatan v dan sudut theta, bola melaju lurus.',
  'Nothing pulls on it, so it never slows down, and it never turns.': 'Tidak ada yang menariknya, jadi bola tidak pernah melambat dan tidak pernah berbelok.',
  'In every half second, it covers exactly the same distance.': 'Setiap setengah detik, bola menempuh jarak yang persis sama.',
  'So its height simply grows with time: the upward part of its speed, v sine theta, multiplied by t.':
    'Jadi ketinggiannya bertambah begitu saja seiring waktu: komponen kecepatan ke atas, v sinus theta, dikali t.',
  'Now switch gravity back on, but keep a ghost of the old ball, still sailing along its straight line.':
    'Sekarang nyalakan kembali gravitasi, tetapi sisakan bayangan bola yang lama, yang masih meluncur di garis lurusnya.',
  'Watch closely. The real ball always stays directly below its ghost.': 'Perhatikan baik-baik. Bola yang sebenarnya selalu berada tepat di bawah bayangannya.',
  'How far below? Exactly as far as a ball you simply let go of would fall in the same time.': 'Seberapa jauh di bawahnya? Persis sejauh bola yang kamu lepaskan begitu saja akan jatuh dalam waktu yang sama.',
  'A dropped ball falls one half g t squared. So that is the gap between the ball and its ghost.':
    'Bola yang dilepas jatuh sejauh satu per dua g t kuadrat. Itulah jarak antara bola dan bayangannya.',
  'So the height is the straight line height, minus the drop.': 'Jadi ketinggiannya adalah tinggi pada garis lurus, dikurangi jarak jatuh.',
  'Here is the drop on its own: a ball let go from rest, with a flash every second.': 'Ini jarak jatuh saja: bola yang dilepas dari diam, dengan kilatan setiap detik.',
  'After one second it has fallen one unit. After two seconds, four units. After three, nine. After four, sixteen.':
    'Setelah satu detik, bola telah jatuh satu satuan. Setelah dua detik, empat satuan. Setelah tiga, sembilan. Setelah empat, enam belas.',
  'So in each second it falls one, then three, then five, then seven units. It keeps speeding up, so every second it falls a little further than the last.':
    'Jadi dalam tiap detik bola jatuh satu, lalu tiga, lalu lima, lalu tujuh satuan. Bola terus bertambah cepat, sehingga setiap detik ia jatuh sedikit lebih jauh daripada detik sebelumnya.',
  'And odd numbers always stack up into perfect squares.': 'Dan bilangan ganjil selalu menumpuk menjadi kuadrat sempurna.',
  'That square is the t squared in the formula.': 'Kuadrat itu adalah t kuadrat dalam rumus.',
  'Pause and ponder. What if the formula had a plain t here, instead of t squared?': 'Berhenti dan renungkan. Bagaimana kalau rumusnya hanya memakai t biasa di sini, bukan t kuadrat?',
  'Then the drop would grow by the same amount every second. Nothing would bend the path, and the ball would never come back down.':
    'Maka jarak jatuh akan bertambah sama besar setiap detik. Tidak ada yang membengkokkan lintasan, dan bola tidak akan pernah turun lagi.',
  'So when does the ball land? At the moment the drop has grown as big as the rise.': 'Lalu kapan bola mendarat? Saat jarak jatuh sudah sebesar kenaikan.',
  'In symbols: the rise equals the drop.': 'Dalam simbol: kenaikan sama dengan jarak jatuh.',
  'Cancel one t from each side,': 'Coret satu t dari tiap sisi,',
  'and out drops the time in the air.': 'dan keluarlah waktu di udara.',
  'The distance is the sideways speed, v cosine theta, times that time.': 'Jaraknya adalah kecepatan mendatar, v kosinus theta, dikali waktu itu.',
  'Put in that time, and two sine theta cosine theta folds neatly into sine two theta.': 'Masukkan waktu itu, dan dua sinus theta kosinus theta menyatu rapi menjadi sinus dua theta.',
  'Sine two theta is largest at forty five degrees, so that is the angle that throws farthest. And thirty and sixty land in exactly the same spot.':
    'Sinus dua theta terbesar pada empat puluh lima derajat, jadi itulah sudut yang melempar paling jauh. Dan tiga puluh dan enam puluh mendarat di tempat yang persis sama.',
  'So a thrown ball is really two simple things at once.': 'Jadi bola yang dilempar sebenarnya adalah dua hal sederhana sekaligus.',
  'A straight line, where it would go if nothing pulled on it. And a drop below that line that grows like t squared.':
    'Sebuah garis lurus, ke mana bola akan pergi jika tidak ada yang menariknya. Dan jarak jatuh di bawah garis itu yang bertambah seperti t kuadrat.',
  'Every parabola you have ever seen is exactly that, and nothing more.': 'Setiap parabola yang pernah kamu lihat persis seperti itu, tidak lebih.',
  'Change the speed and the angle.': 'Ubah kecepatan dan sudutnya.',
  'Try the Moon or Mars by changing g.': 'Coba Bulan atau Mars dengan mengubah g.',
  'What changes with t instead of t squared?': 'Apa yang berubah dengan t, bukan t kuadrat?',
  'Find the angle that lands farthest.': 'Temukan sudut yang mendarat paling jauh.',
  'Pause and ponder': 'Berhenti dan renungkan',
};

const TABLES: Record<Exclude<Lang, 'en'>, Table> = { hi, es, pt, fr, ar, id };

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
