import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, Message, TextChannel } from 'discord.js';
import { flagQuizDatabase } from './database';
import { config } from '../config';
import { flag_quiz_skip_in_process } from './buttonHandler';

export const languageCodes: Record<string, string> = {
    ad: 'Andorra',
    ae: 'Vereinigte Arabische Emirate',
    af: 'Afghanistan',
    ag: 'Antigua und Barbuda',
    ai: 'Anguilla',
    al: 'Albanien',
    am: 'Armenien',
    ao: 'Angola',
    aq: 'Antarktis',
    ar: 'Argentinien',
    as: 'Amerikanisch-Samoa',
    at: 'Österreich',
    au: 'Australien',
    aw: 'Aruba',
    ax: 'Åland',
    az: 'Aserbaidschan',
    ba: 'Bosnien und Herzegowina',
    bb: 'Barbados',
    bd: 'Bangladesch',
    be: 'Belgien',
    bf: 'Burkina Faso',
    bg: 'Bulgarien',
    bh: 'Bahrain',
    bi: 'Burundi',
    bj: 'Benin',
    bl: 'Saint-Barthélemy',
    bm: 'Bermuda',
    bn: 'Brunei',
    bo: 'Bolivien',
    bq: 'Karibische Niederlande',
    br: 'Brasilien',
    bs: 'Bahamas',
    bt: 'Bhutan',
    bv: 'Bouvetinsel',
    bw: 'Botswana',
    by: 'Weißrussland',
    bz: 'Belize',
    ca: 'Kanada',
    cc: 'Kokosinseln',
    cd: 'Kongo',
    cf: 'Zentralafrikanische Republik',
    cg: 'Kongo',
    ch: 'Schweiz',
    ci: 'Elfenbeinküste',
    ck: 'Cookinseln',
    cl: 'Chile',
    cm: 'Kamerun',
    cn: 'China, Volksrepublik',
    co: 'Kolumbien',
    cr: 'Costa Rica',
    cu: 'Kuba',
    cv: 'Kap Verde',
    cw: 'Curacao',
    cx: 'Weihnachtsinsel',
    cy: 'Zypern',
    cz: 'Tschechien',
    de: 'Deutschland',
    dj: 'Dschibuti',
    dk: 'Dänemark',
    dm: 'Dominica',
    do: 'Dominikanische Republik',
    dz: 'Algerien',
    ec: 'Ecuador',
    ee: 'Estland',
    eg: 'Ägypten',
    eh: 'Westsahara',
    er: 'Eritrea',
    es: 'Spanien',
    et: 'Äthiopien',
    eu: 'Europäische Union',
    fi: 'Finnland',
    fj: 'Fidschi',
    fk: 'Falklandinseln',
    fm: 'Mikronesien',
    fo: 'Färöer-Inseln',
    fr: 'Frankreich',
    ga: 'Gabun',
    gb: 'Vereinigtes Königreich',
    'gb-eng': 'England',
    'gb-nir': 'Nordirland',
    'gb-sct': 'Schottland',
    'gb-wls': 'Wales',
    gd: 'Grenada',
    ge: 'Georgien',
    gf: 'Französisch-Guayana',
    gg: 'Guernsey',
    gh: 'Ghana',
    gi: 'Gibraltar',
    gl: 'Grönland',
    gm: 'Gambia',
    gn: 'Guinea',
    gp: 'Guadeloupe',
    gq: 'Äquatorialguinea',
    gr: 'Griechenland',
    gs: 'Südgeorgien und die Südlichen Sandwichinseln',
    gt: 'Guatemala',
    gu: 'Guam',
    gw: 'Guinea-Bissau',
    gy: 'Guyana',
    hk: 'Hongkong',
    hm: 'Heard und die McDonaldinseln',
    hn: 'Honduras',
    hr: 'Kroatien',
    ht: 'Haiti',
    hu: 'Ungarn',
    id: 'Indonesien',
    ie: 'Irland',
    il: 'Israel',
    im: 'Insel Man',
    in: 'Indien',
    io: 'Britisches Territorium im Indischen Ozean',
    iq: 'Irak',
    ir: 'Iran',
    is: 'Island',
    it: 'Italien',
    je: 'Jersey',
    jm: 'Jamaika',
    jo: 'Jordanien',
    jp: 'Japan',
    ke: 'Kenia',
    kg: 'Kirgisistan',
    kh: 'Kambodscha',
    ki: 'Kiribati',
    km: 'Komoren',
    kn: 'St. Kitts und Nevis',
    kp: 'Nordkorea',
    kr: 'Südkorea',
    kw: 'Kuwait',
    ky: 'Kaimaninseln',
    kz: 'Kasachstan',
    la: 'Laos',
    lb: 'Libanon',
    lc: 'St. Lucia',
    li: 'Liechtenstein',
    lk: 'Sri Lanka',
    lr: 'Liberia',
    ls: 'Lesotho',
    lt: 'Litauen',
    lu: 'Luxemburg',
    lv: 'Lettland',
    ly: 'Libyen',
    ma: 'Marokko',
    mc: 'Monaco',
    md: 'Moldawien',
    me: 'Montenegro',
    mf: 'Saint-Martin',
    mg: 'Madagaskar',
    mh: 'Marshallinseln',
    mk: 'Nordmazedonien',
    ml: 'Mali',
    mm: 'Myanmar',
    mn: 'Mongolei',
    mo: 'Macau',
    mp: 'Nördliche Marianen',
    mq: 'Martinique',
    mr: 'Mauretanien',
    ms: 'Montserrat',
    mt: 'Malta',
    mu: 'Mauritius',
    mv: 'Malediven',
    mw: 'Malawi',
    mx: 'Mexiko',
    my: 'Malaysia',
    mz: 'Mosambik',
    na: 'Namibia',
    nc: 'Neukaledonien',
    ne: 'Niger',
    nf: 'Norfolkinsel',
    ng: 'Nigeria',
    ni: 'Nicaragua',
    nl: 'Niederlande',
    no: 'Norwegen',
    np: 'Nepal',
    nr: 'Nauru',
    nu: 'Niue',
    nz: 'Neuseeland',
    om: 'Oman',
    pa: 'Panama',
    pe: 'Peru',
    pf: 'Französisch-Polynesien',
    pg: 'Papua-Neuguinea',
    ph: 'Philippinen',
    pk: 'Pakistan',
    pl: 'Polen',
    pm: 'St. Pierre und Miquelon',
    pn: 'Pitcairninseln',
    pr: 'Puerto Rico',
    ps: 'Palästina',
    pt: 'Portugal',
    pw: 'Palau',
    py: 'Paraguay',
    qa: 'Katar',
    re: 'Réunion',
    ro: 'Rumänien',
    rs: 'Serbien',
    ru: 'Russland',
    rw: 'Ruanda',
    sa: 'Saudi-Arabien',
    sb: 'Salomonen',
    sc: 'Seychellen',
    sd: 'Sudan',
    se: 'Schweden',
    sg: 'Singapur',
    sh: 'St. Helena, Ascension und Tristan da Cunha',
    si: 'Slowenien',
    sj: 'Spitzbergen und Jan Mayen',
    sk: 'Slowakei',
    sl: 'Sierra Leone',
    sm: 'San Marino',
    sn: 'Senegal',
    so: 'Somalia',
    sr: 'Suriname',
    ss: 'Südsudan',
    st: 'Sao Tome und Principe',
    sv: 'El Salvador',
    sx: 'Sint Maarten',
    sy: 'Syrien',
    sz: 'Swasiland',
    tc: 'Turks- und Caicosinseln',
    td: 'Tschad',
    tf: 'Französische Süd- und Antarktisgebiete',
    tg: 'Togo',
    th: 'Thailand',
    tj: 'Tadschikistan',
    tk: 'Tokelau',
    tl: 'Osttimor',
    tm: 'Turkmenistan',
    tn: 'Tunesien',
    to: 'Tonga',
    tr: 'Türkei',
    tt: 'Trinidad und Tobago',
    tv: 'Tuvalu',
    tw: 'Taiwan',
    tz: 'Tansania',
    ua: 'Ukraine',
    ug: 'Uganda',
    um: 'Kleinere Inselbesitzungen der Vereinigten Staaten',
    un: 'Vereinte Nationen',
    us: 'Vereinigte Staaten',
    'us-ak': 'Alaska',
    'us-al': 'Alabama',
    'us-ar': 'Arkansas',
    'us-az': 'Arizona',
    'us-ca': 'Kalifornien',
    'us-co': 'Colorado',
    'us-ct': 'Connecticut',
    'us-de': 'Delaware',
    'us-fl': 'Florida',
    'us-ga': 'Georgia',
    'us-hi': 'Hawaii',
    'us-ia': 'Iowa',
    'us-id': 'Idaho',
    'us-il': 'Illinois',
    'us-in': 'Indiana',
    'us-ks': 'Kansas',
    'us-ky': 'Kentucky',
    'us-la': 'Louisiana',
    'us-ma': 'Massachusetts',
    'us-md': 'Maryland',
    'us-me': 'Maine',
    'us-mi': 'Michigan',
    'us-mn': 'Minnesota',
    'us-mo': 'Missouri',
    'us-ms': 'Mississippi',
    'us-mt': 'Montana',
    'us-nc': 'North Carolina',
    'us-nd': 'North Dakota',
    'us-ne': 'Nebraska',
    'us-nh': 'New Hampshire',
    'us-nj': 'New Jersey',
    'us-nm': 'New Mexico',
    'us-nv': 'Nevada',
    'us-ny': 'New York',
    'us-oh': 'Ohio',
    'us-ok': 'Oklahoma',
    'us-or': 'Oregon',
    'us-pa': 'Pennsylvania',
    'us-ri': 'Rhode Island',
    'us-sc': 'South Carolina',
    'us-sd': 'South Dakota',
    'us-tn': 'Tennessee',
    'us-tx': 'Texas',
    'us-ut': 'Utah',
    'us-va': 'Virginia',
    'us-vt': 'Vermont',
    'us-wa': 'Washington',
    'us-wi': 'Wisconsin',
    'us-wv': 'West Virginia',
    'us-wy': 'Wyoming',
    uy: 'Uruguay',
    uz: 'Usbekistan',
    va: 'Vatikanstadt',
    vc: 'St. Vincent und die Grenadinen',
    ve: 'Venezuela',
    vg: 'Britische Jungferninseln',
    vi: 'Amerikanische Jungferninseln',
    vn: 'Vietnam',
    vu: 'Vanuatu',
    wf: 'Wallis und Futuna',
    ws: 'Samoa',
    xk: 'Kosovo',
    ye: 'Jemen',
    yt: 'Mayotte',
    za: 'Südafrika',
    zm: 'Sambia',
    zw: 'Simbabwe',
};

export const flagQuizPanelEmbed = (languageCode: string) =>
    new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle('🚩 › Flaggenquiz')
        .setImage(`https://flagcdn.com/w2560/${languageCode}.png`);

export const flagQuizPanelRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId('flag_quiz_skip')
        .setDisabled(false)
        .setEmoji('▶️')
        .setLabel('Skip')
        .setStyle(ButtonStyle.Primary),
);

export const initFlagQuiz = async (client: Client) => {
    let flagQuizData: { languageCode: string; messageId: string } = flagQuizDatabase.get('flag_quiz_data');
    const channel: TextChannel = await client.channels.fetch(config.flagQuizChannelId).catch(() => null);

    if (!channel || !channel?.isTextBased()) {
        return console.log('error: 432846329');
    }

    if (!flagQuizData) {
        const radomedLanguageCodeKey: string =
            Object.keys(languageCodes)[Math.floor(Math.random() * Object.keys(languageCodes).length)];
        const message = await channel.send({
            embeds: [flagQuizPanelEmbed(radomedLanguageCodeKey)],
            components: [flagQuizPanelRow],
        });

        flagQuizData = flagQuizDatabase.set('flag_quiz_data', {
            languageCode: radomedLanguageCodeKey,
            messageId: message.id,
        }) as unknown as { languageCode: string; messageId: string };
    }

    const message = await channel.messages.fetch({ message: flagQuizData.messageId, force: true }).catch(() => null);

    if (!message) {
        const message = await channel.send({
            embeds: [flagQuizPanelEmbed(flagQuizData.languageCode)],
            components: [flagQuizPanelRow],
        });

        flagQuizData.messageId = message.id;

        flagQuizData = flagQuizDatabase.set('flag_quiz_data', flagQuizData) as unknown as {
            languageCode: string;
            messageId: string;
        };
    }
};

export const handleFlagQuizAnswer: any = async (client: Client, message: Message<true>) => {
    if (message.author.bot) return;
    if (flag_quiz_skip_in_process) return;

    const flagQuizData: { languageCode: string; messageId: string } = flagQuizDatabase.get('flag_quiz_data');

    if (languageCodes[flagQuizData.languageCode].toLowerCase() !== message.content.toLowerCase())
        return message.react('❌');

    // correct
    let messagesToDelete = await message.channel.messages.fetch({ limit: 100 });

    while (messagesToDelete.size > 0) {
        await message.channel.bulkDelete(messagesToDelete);
        messagesToDelete = await message.channel.messages.fetch({ limit: 100 });
    }

    // reroll (lmao)
    const radomedLanguageCodeKey: string =
        Object.keys(languageCodes)[Math.floor(Math.random() * Object.keys(languageCodes).length)];
    const sentMessage = await message.channel.send({
        content: `${message.author.toString()} hat die richtige Lösung gefunden!`,
        embeds: [flagQuizPanelEmbed(radomedLanguageCodeKey)],
        components: [flagQuizPanelRow],
        allowedMentions: { users: [message.author.id] },
    });

    flagQuizDatabase.set('flag_quiz_data', {
        languageCode: radomedLanguageCodeKey,
        messageId: sentMessage.id,
    }) as unknown as { languageCode: string; messageId: string };
};
