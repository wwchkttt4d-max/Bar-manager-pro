// ══════════════════════════════════════════════════════════════
// GAMMA — Système de gestion de stock intelligent
// ══════════════════════════════════════════════════════════════

// ── CONSTANTS ──────────────────────────────────────────────────
const GAMMA_CATS = {
  all:        { label: 'Tout',       emoji: '📦', color: 'var(--teal)' },
  spiritueux: { label: 'Spiritueux', emoji: '🥃', color: 'var(--amber)' },
  bieres:     { label: 'Bières',     emoji: '🍺', color: 'var(--gold)' },
  vins:       { label: 'Vins',       emoji: '🍷', color: 'var(--rose)' },
  softs:      { label: 'Softs',      emoji: '🥤', color: 'var(--blue)' },
  sirops:     { label: 'Sirops',     emoji: '🍯', color: 'var(--teal)' },
  garnitures: { label: 'Garnitures', emoji: '🍋', color: 'var(--green)' },
  autre:      { label: 'Autre',      emoji: '📦', color: 'var(--violet)' }
};

const CAT_EMOJI  = { cocktail:'🍸', force:'❄️', smoothie:'🥤', bubble_tea:'🧋', the_glace:'🍵', cafe:'☕', dessert:'🍮', autre:'🍽️' };
const CAT_LABEL  = { cocktail:'Cocktail', force:'Force', smoothie:'Smoothie', bubble_tea:'Bubble Tea', the_glace:'Thé glacé', cafe:'Café', dessert:'Dessert', autre:'Autre' };
const CAT_COLOR  = { cocktail:'var(--violet)', force:'var(--teal)', smoothie:'var(--green)', bubble_tea:'var(--rose)', the_glace:'var(--blue)', cafe:'var(--amber)', dessert:'var(--gold)' };
const CAT_BG     = { cocktail:'rgba(168,85,247,0.08)', force:'rgba(0,210,200,0.08)', smoothie:'rgba(16,185,129,0.08)', bubble_tea:'rgba(255,107,157,0.08)', the_glace:'rgba(59,130,246,0.08)', cafe:'rgba(255,159,67,0.08)', dessert:'rgba(245,200,66,0.08)' };

// ── APP STATE ───────────────────────────────────────────────────
let gammaActiveCat = 'all';
let inventoryMode  = false;
let consumptionChart = null;
let _unsubStockListener    = null;
let _unsubNotifListener    = null;
let _unsubActivityListener = null;
let _unsubVentesListener   = null;

// Local cache synced from Firestore
const cache = {
  stock:         [],
  notifications: [],
  activity:      [],
  ventes:        [],
  equipe: [
    { id:1, nom:'Jean Dupont',    poste:'Barman',   actif:true,  horaire:'18h-02h', avatar:'👨‍🍳' },
    { id:2, nom:'Marie Martin',   poste:'Serveuse', actif:true,  horaire:'20h-04h', avatar:'👩‍💼' },
    { id:3, nom:'Pierre Durand',  poste:'Manager',  actif:true,  horaire:'17h-01h', avatar:'👨‍💼' },
    { id:4, nom:'Sophie Bernard', poste:'Serveuse', actif:false, horaire:'18h-02h', avatar:'👩‍🍳' }
  ]
};

// Default stock seed data
const SEED_STOCK = [
  { nom:'Rhum Blanc',        categorie:'spiritueux', quantite:12, quantiteMin:5,  prix:18, unite:'bouteilles' },
  { nom:'Vodka',             categorie:'spiritueux', quantite:8,  quantiteMin:4,  prix:20, unite:'bouteilles' },
  { nom:'Gin',               categorie:'spiritueux', quantite:6,  quantiteMin:4,  prix:22, unite:'bouteilles' },
  { nom:'Tequila',           categorie:'spiritueux', quantite:4,  quantiteMin:3,  prix:25, unite:'bouteilles' },
  { nom:'Whisky',            categorie:'spiritueux', quantite:5,  quantiteMin:3,  prix:28, unite:'bouteilles' },
  { nom:'Mezcal',            categorie:'spiritueux', quantite:2,  quantiteMin:2,  prix:35, unite:'bouteilles' },
  { nom:'Cachaca',           categorie:'spiritueux', quantite:3,  quantiteMin:2,  prix:18, unite:'bouteilles' },
  { nom:'Aperol',            categorie:'spiritueux', quantite:4,  quantiteMin:3,  prix:14, unite:'bouteilles' },
  { nom:'Prosecco',          categorie:'vins',       quantite:18, quantiteMin:8,  prix:9,  unite:'bouteilles' },
  { nom:'Vin Rouge',         categorie:'vins',       quantite:12, quantiteMin:6,  prix:7,  unite:'bouteilles' },
  { nom:'Bière Pression',    categorie:'bieres',     quantite:80, quantiteMin:30, prix:3,  unite:'pièces' },
  { nom:'Bière Bouteille',   categorie:'bieres',     quantite:48, quantiteMin:20, prix:4,  unite:'pièces' },
  { nom:'Coca-Cola',         categorie:'softs',      quantite:60, quantiteMin:24, prix:2,  unite:'pièces' },
  { nom:'Ginger Beer',       categorie:'softs',      quantite:36, quantiteMin:12, prix:3,  unite:'pièces' },
  { nom:'Limonade',          categorie:'softs',      quantite:24, quantiteMin:12, prix:2,  unite:'pièces' },
  { nom:'Jus de Litchi',     categorie:'softs',      quantite:8,  quantiteMin:4,  prix:4,  unite:'bouteilles' },
  { nom:'Sirop Sucre Canne', categorie:'sirops',     quantite:6,  quantiteMin:3,  prix:5,  unite:'bouteilles' },
  { nom:'Sirop Pastèque',    categorie:'sirops',     quantite:3,  quantiteMin:2,  prix:6,  unite:'bouteilles' },
  { nom:'Sirop Rose',        categorie:'sirops',     quantite:4,  quantiteMin:2,  prix:6,  unite:'bouteilles' },
  { nom:'Purée Mangue',      categorie:'garnitures', quantite:5,  quantiteMin:3,  prix:8,  unite:'kg' },
  { nom:'Purée Fruits Rouges',categorie:'garnitures',quantite:4, quantiteMin:3,  prix:8,  unite:'kg' },
  { nom:'Citrons Verts',     categorie:'garnitures', quantite:50, quantiteMin:20, prix:0.5,unite:'pièces' },
  { nom:'Menthe Fraîche',    categorie:'garnitures', quantite:8,  quantiteMin:4,  prix:2,  unite:'bottes' },
];

// ── RECIPES ─────────────────────────────────────────────────────
const RECIPES = [{"id":1,"name":"Gin tonic pêche","ingredients":["4cl de gin","Tonic peche et sureau","2 tranches de Citron jaune","une branche de romarin","2 tranches de peche","baie de genievre","2cl de crème de peche"],"steps":["Mettre les glaçons Dans le verre et le citron et une tranche de peche","Verser le gin et le tonic et la crème de peche","mélanger rapidement","Décorer d'une tranche de peche et d'une branche de romarin","Ecraser qq baies de genievre et les poser dessus"],"category":"cocktail"},{"id":2,"name":"Kim Long","ingredients":["1,5cl de sirop de rose","2cl de soho","15cl de jus de litchi","15cl de prosecco","3 petale de rose","1 branche de bamboo"],"steps":["Mettre les glaçons","Mettre l' alcool et le sirop","Verser le jus et le prosecco","planter la feuille de bamboo et poser sur la feuille des pétales"],"category":"cocktail"},{"id":3,"name":"Mise au vert","ingredients":["8cl de cordial concombre verveine menthe","1cl de citron","10cl de lillet blanc","2cl de st germain","1 tranche de concombre","1 tete de menthe","1 dash de tonic","1cl de sirop de fleur sureau"],"steps":["remplir le verre de glacons","Mettre le cordial, le citron, le lillet et le st germain","toper de badoit et mélanger un peu","Décorer avec la tranche de concombre et la menthe"],"category":"cocktail"},{"id":4,"name":"Shinzo","ingredients":["3cl de purée de fruits rouges","1cl de citron","1cl de yuzu","2cl de sirop de pasteque","1cl de sirop d'agave","1 poignée de pasteque","1cl de mezcal","4cl de tequila","2 feuilles de shizo"],"steps":["piler la pasteque et 1 feuille de shizo dans le shaker","shaker les sirop, les alcools, les citrons et la purée","verser dans un verre remplis de glacons","décorer d'une feuille de shizo"],"category":"cocktail"},{"id":5,"name":"Sticky rice","ingredients":["5cl de Rhum","3cl de purée de mangue","1cl de citron vert","zeste citron vert et poudre piment","1cl de sirop de vanille","1cl de sirop de fleur de sureau","5cl de lait de coco infusé au riz","feuille de riz crispy"],"steps":["Shaker tous les éléments avec glacons","verser dans le verre","Décorer d'un zeste de citron vert","Poser la feuille de riz","zester du citron vert et saupoudrer du piment"],"category":"cocktail"},{"id":6,"name":"Viet Mûle","ingredients":["5cl de vodka","2cl de citron vert","1cl de sucre","Mousse gingembre","1 pincée de basilic","zeste de citron","Badoit rouge","Romarin"],"steps":["Mettre tous les ingrédients sauf la mousse dans un shaker pleins de glaçons et shaker","Shaker","Filtrer et verser dans un verre Caipi pleins de glacons","Remplir de badoit","Toper de mousse","zester du citron vert et mettez des feuilles de romarin"],"category":"cocktail"},{"id":7,"name":"Petit rouge","ingredients":["10cl de granité","3cl de purée de fruits rouge","1cl de sirop de pasteque","4cl de vodka","1 feuille de bamboo déco","2cl de jus de pasteque"],"steps":["Verser la granité dans le verre.","Ajouter les purées, le sirop et la vodka","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},{"id":8,"name":"Petit jaune","ingredients":["10cl de granité","2cl de purée de fruit de la passion","4cl de rhum","1 feuille de bamboo"],"steps":["Verser la granité dans le verre.","Ajouter la purée de passion et le rhum.","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},{"id":9,"name":"Petit vert","ingredients":["10cl de granité","4cl de gin","1,5cl de purée de concombre","3cl de ginger beer","1 feuille de bamboo déco"],"steps":["Verser la granité dans un verre.","Ajouter les liquides","Mélanger et toper à la glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},{"id":10,"name":"Petit bleu","ingredients":["10cl de granité","2cl de coco","1cl de curacao","4cl de rhum","2cl de jus d'ananas","1 feuille de bamboo"],"steps":["Verser la granité dans le verre.","Ajouter le coco, le curaçao et le rhum et l'ananas","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},{"id":11,"name":"Petit Force Orange","ingredients":["10cl de granité","4cl de Vodka Eristoff","1,5cl de purée de mangue","2cl de brisure de framboise","Une feuille de bamboo"],"steps":["Verser la granité dans un verre.","Ajouter la purée de mangue, la framboise et la vodka.","Mélanger et toper à la glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},{"id":12,"name":"Force rouge","ingredients":["20cl de granité","4cl de purée de fruit rouge","4cl de jus de pasteque","6cl de vodka","2cl de sirop de pasteque","1 feuille de bamboo déco"],"steps":["Verser la granité dans le verre.","Ajouter les purées et sirops et la vodka","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},{"id":13,"name":"Force jaune","ingredients":["20cl de granité","4cl de purée de fruit de la passion","6cl de rhum","1 feuille de bamboo"],"steps":["Verser la granité dans le verre.","Ajouter la purée de passion et le rhum.","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},{"id":14,"name":"Force verte","ingredients":["20cl de granité","6cl de gin","4cl de purée de concombre","4cl de ginger beer","1 feuille de bamboo déco"],"steps":["Verser la granité dans un verre.","Ajouter la purée et le gin, et le ginger beer","Mélanger et toper à la glace pilée.","Décorer de la feuille de bamboo et d'un citron deshydraté"],"category":"force"},{"id":15,"name":"Force bleue","ingredients":["20cl de granité","4cl de coco","2cl de curacao","6cl de rhum","4cl de jus d'ananas","1 feuille de bamboo"],"steps":["Verser la granité dans le verre.","Ajouter la coco, le curaçao et le rhum.","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},{"id":16,"name":"Force orange","ingredients":["20cl de granité","6cl de Vodka Eristoff","2cl de purée de mangue","3cl de purée de fruits rouges","Une feuille de bamboo"],"steps":["Verser la granité dans un verre.","Ajouter la purée de mangue, la framboise et la vodka.","Mélanger et toper à la glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},{"id":17,"name":"Smoothie mangue coco","ingredients":["150gr de glace pilée","75gr de purée de mangue","75gr de jus d'ananas","150gr de purée de coco","2cl de sucre de canne","1 citron déshydraté"],"steps":["mettre les ingrédients dans le blender","mixer et verser dans le verre","Décorer d'une tranche de citron déshydraté"],"category":"smoothie"},{"id":18,"name":"Smoothie mangue basilic","ingredients":["150gr de glace pilée","100gr de purée de mangue","3cl de lait concentré sucrée","3 feuilles de basilic","100gr de jus de mangue","2cl de sucre de canne"],"steps":["mettre les ingrédients dans le blender","mixer et verser dans le verre","Décorer d'une tranche de citron déshydraté"],"category":"smoothie"},{"id":19,"name":"Smoothie fruits rouge acai","ingredients":["150gr de glace pilée","150gr de purée de fruits rouge","150gr de jus de canneberge","4gr de purée d'acai","4cl de sucre de canne","1 citron déshydraté"],"steps":["mettre les ingrédients dans le blender","mixer et verser dans le verre","Décorer d'une tranche de citron déshydraté"],"category":"smoothie"},{"id":20,"name":"Smoothie melon","ingredients":["150gr de glace pilée","300gr de purée de melon","4 feuilles de menthe","2cl de jus de citron","1 citron déshydraté + tete menthe déco"],"steps":["mettre les ingrédients dans le blender","mixer et verser dans le verre","Décorer d'une tranche de citron déshydraté"],"category":"smoothie"},{"id":21,"name":"Smoothie pastèque","ingredients":["150gr de glace pilée","150gr de purée de fruits rouge","200gr de purée de pastèque","4cl de sirop de pastèque","2cl de sucre de canne","1 citron déshydraté + feuille bambou"],"steps":["mettre les ingrédients dans le blender","mixer et verser dans le verre","Décorer d'une tranche de citron déshydraté"],"category":"smoothie"},{"id":22,"name":"Bubble Vai","ingredients":["1 louche de bille passion","1cl de citron","jus de litchi","1 tranche de citron vert"],"steps":["Mettre la louche de bille dans le verre.","Le remplir de glacons.","Toper au jus de litchi et décorer d'une tranche de citron vert."],"category":"bubble_tea"},{"id":23,"name":"Bubble Mojito","ingredients":["1 louche de bille citron vert","2 dès de citron vert","1 pincée de menthe","limonade","1 tête de menthe"],"steps":["Mettre les citron vert et les piler","Ajouter les billes et la menthe","Remplir de glacons","Toper de limonade","Mélanger rapidement et décorer d'une tête de menthe"],"category":"bubble_tea"},{"id":24,"name":"Bubble Tea Dragon","ingredients":["1 louche de perles fruit du dragon","2cl de purée de passion","18cl de thé Earl Grey froid","2cl de sucre de canne","1 rondelle de citron jaune"],"steps":["Mettre une louche de perles dans le verre.","Remplir de glaçons.","Ajouter la passion et le thé","Mélanger vigoureusement","Décorer d'une rondelle de citron jaune."],"category":"bubble_tea"},{"id":25,"name":"Bubble Mango Milk","ingredients":["1 louche de perles de tapioca","4cl de purée de mangue","1cl de sucre de canne","lait","chantilly","1 tranche de citron déshydraté"],"steps":["Mettre une louche de perles de tapioca dans le verre.","Ajouter le lait shaké avec la mangue et le sucre","Remplir le verre de glaçons et verser le lait à la mangue","Décorer d'un dome de chantilly","Poser le citron"],"category":"bubble_tea"},{"id":26,"name":"Bubble Tarot Coco","ingredients":["1 louche de perles de tapioca","2 cuillère à soupe de poudre de tarot","Lait","Chantilly","4cl de coco"],"steps":["Mettre une louche de perles de tapioca dans le verre.","Ajouter le lait shaké avec la poudre et le coco","Remplir le verre de glaçons et verser le lait au tarot","Décorer d'un dome de chantilly","Saupoudrer de poudre de tarot"],"category":"bubble_tea"},{"id":27,"name":"Ice tea passion","ingredients":["2cl de purée de passion","3cl de purée de mangue","2cl de sirop de fleur de sureau","thé glacé","1 branche de romarin","1 tranche de citron vert déshydraté"],"steps":["Mettre les purées, les sirops dans le verre.","Remplir le verre de glacons.","Verser le thé et mélanger","Décorer d'un dôme de glace pilée et d'une tranche de citron vert déshydraté et d'une branche de romarin"],"category":"the_glace"},{"id":28,"name":"Thé glacé pêche","ingredients":["2cl de citron","2cl de sirop de peche","2cl de purée de peche","1 pincée de menthe","1 tête de menthe","1 tranche de citron vert déshydraté","Thé earl grey froid"],"steps":["Mettre les purées et les sirops dans le verre.","Remplir le verre de glacons.","Verser le thé et mélanger","Décorer d'un dôme de glace pilée et d'une tranche de citron vert et d'une tete de menthe"],"category":"the_glace"},{"id":29,"name":"La vie en rose","ingredients":["2cl de citron","8cl de purée de fruits rouges","2cl de sirop d'orgeat","Top badoit","Espuma gingembre"],"steps":["Shaker tous les éléments ensemble sans la mousse","Remplir le verre de glacons et verser","Toper de badoit puis Mettre la mousse","Décorer de qq feuilles de romarin"],"category":"the_glace"},{"id":30,"name":"Citronnade kalamansi","ingredients":["5cl de sirop de sucre de canne","5cl de kalamansi","Eau 20cl","45cl de glace pilée","fleur d'alysse"],"steps":["Verser le sirop de sucre et le kalamansi dans un blender","ajouter la glace pilée et l'eau","mixer et verser dans le verre doucement","completer avec un peu d'eau au centre si besoin","Décorer d'une fleur d'alysse"],"category":"the_glace"},{"id":31,"name":"You Zou","ingredients":["3cl de sirop de sucre de canne","3cl de Yuzu","Eau","1 rondelle de citron jaune"],"steps":["Verser le sirop de sucre et le yuzu.","Remplir le verre de glaçons.","Toper à l'eau.","Décorer d'un peu de glace pilée et d'une rondelle de citron jaune."],"category":"the_glace"},{"id":32,"name":"Kipik","ingredients":["1cl de citron","1 pincée de menthe","Ginger beer","Limonade","1 tranche de citron vert"],"steps":["Remplir le verre de glaçons.","Ajouter le citron et la menthe.","Ajouter du ginger beer jusqu'au 2/3 du verre.","Toper à la limonade.","Mélanger délicatement et décorer d'un peu de glace pilée et d'une tranche de citron vert."],"category":"the_glace"},{"id":33,"name":"Café latte Hanoi","ingredients":["15cl de café vietnamien froid","2cl de lait concentré sucrée"],"steps":["Mettre le lait concentré sucrée dans le verre.","Remplir le verre de glace pilée.","Ajouter le café."],"category":"cafe"},{"id":34,"name":"Matcha latte","ingredients":["2 cuillère à soupe de matcha","lait"],"steps":["Mettre le matcha dans un bol et une dose de lait","Faire chauffer le lait/matcha","Verser le lait/matcha dans le mug","Faire mousser du lait et le verser un nuage par-dessus","Saupoudrer de matcha"],"category":"cafe"},{"id":35,"name":"Dirty Chai","ingredients":["1 cuillère doseuse de chai latte","lait","1 shot d'expresso"],"steps":["Mettre le chaï dans un bol et une dose de lait","Faire chauffer le lait/chaï","Verser le lait/chaï dans un mug","Faire mousser du lait et le verser pour faire un nuage par-dessus","verser 1 shot d'expresso","Saupoudrer de poudre chai"],"category":"cafe"},{"id":36,"name":"Chai latte","ingredients":["1 cuillère doseuse de chai latte","lait"],"steps":["Mettre le chaï dans un bol et une dose de lait","Faire chauffer le lait/chaï","Verser le lait/chaï dans un mug","Faire mousser du lait et le verser pour faire un nuage par-dessus","Saupoudrer de poudre chai"],"category":"cafe"},{"id":37,"name":"Le Mojito","ingredients":["4 dés de citron vert","2cl de sirop de sucre de canne","1 pincée de feuille de menthe","4cl de rhum","1 dash de Badoit","1 dash d'angostura","1 tête de menthe"],"steps":["Mettre la menthe, le citron vert et le sucre de canne dans le verre.","Piler le tout 2/3 fois pour extraire le jus et les arômes.","Remplir le verre de glace pilée.","Ajouter le rhum, le dash d'angostura et la badoit.","Mélanger pour faire remonter la menthe.","Décorer d'un dôme de glace pilée et d'une tête de menthe."],"category":"cocktail"},{"id":38,"name":"Spritz","ingredients":["6cl d'aperol","2/3 prosecco","1/3 badoit","1 tranche d'orange"],"steps":["Remplir le verre de glaçons.","Mettre tous les ingrédients dans un verre à piscine.","Mélanger rapidement","ajouter l'orange par dessus"],"category":"cocktail"},{"id":39,"name":"Gin tonic","ingredients":["4cl de gin","Tonic","2 tranches de Citron jaune","1cl de jus de citron"],"steps":["Mettre les glaçons Dans le verre et le citron","Verser le gin et le tonic","mélanger rapidement","Décorer d'un citron deshydraté, d'une branche de romarin","Ecraser qq baies de genievre et les poser dessus"],"category":"cocktail"},{"id":40,"name":"Margarita","ingredients":["2cl de citron","2cl de cointreau","1cl de sucre de canne","1 pincée de sel","4cl de tequila"],"steps":["Tout mettre dans le shaker remplis de glacons","shaker énergiquement","verser dans le verre","Toper de glace pilée","Décorer d'une tranche de citron deshydraté"],"category":"cocktail"},{"id":41,"name":"Caipirinhia","ingredients":["8 morceau de citron vert","2cl de sirop de sucre de canne","6cl de cachaca","1 tranche de citron deshydraté"],"steps":["Tout mettre dans le shaker remplis de glacons","shaker énergiquement","verser dans le verre","Toper de glace pilée","Décorer d'une tranche de citron deshydraté"],"category":"cocktail"},{"id":42,"name":"Cam Quat (Chia)","ingredients":["130g de chia coco","40gr de mangue passion","1 tête de menthe","1 zeste de citron vert"],"steps":["Déposer le chia dans un bol","déposer 40gr par dessus de mélange passion mangue","Déposer dessus la tête de menthe","Déposer sur un bol de glacons"],"category":"dessert"},{"id":43,"name":"Café gourmand","ingredients":["1 bol de chia + mangue passion","1 mochi coco","1 mini crème brulée","1 café","1 feuille bamboo"],"steps":["Déposer sur une planche la feuille de bamboo","Y déposer les desserts","Faire bruler la crème brulée","Poser le café","Déposer le café ou thé sur la planche"],"category":"dessert"},{"id":44,"name":"Fortune Cookie Vanille","ingredients":["1 cookie chocolat","1 boule de glace vanille","1 cuillere à soupe de cacahuete","1 tête de menthe"],"steps":["Faite rechauffer le cookie 30sec au micro onde","Ajouter les cacahuetes puis la glace","Poser une tête de menthe"],"category":"dessert"},{"id":45,"name":"Fortune Cookie Coco","ingredients":["1 cookie chocolat","1 boule de glace coco","1 cuillère à soupe de coco rapée","1 tête de menthe"],"steps":["Faite rechauffer le cookie 30sec au micro onde","Ajouter la coco et la glace","Décorer d'une tête de menthe"],"category":"dessert"},{"id":46,"name":"Gato So Cola","ingredients":["1 moêlleux chocolat","1 boule de glace vanille rase","1 plaque choco"],"steps":["Faite rechauffer le moelleux 30sec au micro onde","Ajouter la boule de glace rase par dessus","Ajouter la plaque"],"category":"dessert"},{"id":47,"name":"Crème brulée sésame","ingredients":["1 crème brulée","10gr de sucre fin","1 ptt cuillère à glace de glace coco"],"steps":["Saupoudrer de sucre fin sur toute la surface","Retourner la crème en tapant pour enlever l'excédent","Caraméliser au chalumeau","Ajouter la boule de glace"],"category":"dessert"}];

// ── PARTICLES ────────────────────────────────────────────────────
(function spawnParticles() {
  const cont = document.getElementById('particles');
  const colors = ['#00d2c8','#a855f7','#f5c842','#ff9f43','#ff6b9d','#3b82f6'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*15+10}s;animation-delay:-${Math.random()*15}s;`;
    cont.appendChild(p);
  }
})();

// ── AUTH ─────────────────────────────────────────────────────────
window._showApp = function(user) {
  const ls = document.getElementById('loginScreen');
  ls.classList.add('hiding');
  setTimeout(() => {
    ls.style.display = 'none';
    const appEl = document.getElementById('app');
    appEl.style.display = 'block';
    requestAnimationFrame(() => appEl.classList.add('visible'));
    const name = (user.email || '').split('@')[0];
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById('userName').textContent = displayName;
    document.getElementById('userAvatar').textContent = displayName.charAt(0).toUpperCase();
    document.getElementById('dashName').textContent = displayName;
    updateWelcome(displayName);
    initApp();
  }, 800);
};

window._showLogin = function() {
  // Unsubscribe all listeners on logout
  [_unsubStockListener, _unsubNotifListener, _unsubActivityListener, _unsubVentesListener]
    .forEach(fn => fn && fn());
  const ls = document.getElementById('loginScreen');
  document.getElementById('app').style.display = 'none';
  document.getElementById('app').classList.remove('visible');
  ls.style.display = 'flex';
  ls.classList.remove('hiding');
  ls.style.opacity = '0';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  requestAnimationFrame(() => { ls.style.transition = 'opacity 0.5s'; ls.style.opacity = '1'; });
};

async function tryLogin() {
  const email = document.getElementById('loginUser').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const err   = document.getElementById('loginError');
  const btn   = document.getElementById('loginBtn');
  if (!email || !pass) { err.textContent = '❌ Veuillez remplir tous les champs'; err.style.display = 'block'; return; }
  btn.disabled = true;
  document.getElementById('loginBtnText').style.display = 'none';
  document.getElementById('loginBtnSpinner').style.display = 'inline';
  err.style.display = 'none';
  try {
    await window._fbSignIn(email, pass);
  } catch(e) {
    btn.disabled = false;
    document.getElementById('loginBtnText').style.display = 'inline';
    document.getElementById('loginBtnSpinner').style.display = 'none';
    const msgs = {
      'auth/user-not-found':'❌ Aucun compte trouvé',
      'auth/wrong-password':'❌ Mot de passe incorrect',
      'auth/invalid-email':'❌ Email invalide',
      'auth/too-many-requests':'⚠️ Trop de tentatives',
      'auth/invalid-credential':'❌ Email ou mot de passe incorrect'
    };
    err.textContent = msgs[e.code] || '❌ ' + (e.message || 'Erreur inconnue');
    err.style.display = 'block';
    document.querySelector('.login-box').style.animation = 'shake 0.4s ease';
    setTimeout(() => document.querySelector('.login-box').style.animation = '', 400);
  }
}

async function doLogout() {
  showToast('Au revoir ! 👋', 'info');
  const overlay = document.getElementById('logoutOverlay');
  overlay.classList.add('visible');
  setTimeout(async () => {
    try { if (window._fbSignOut) await window._fbSignOut(); } catch(e) {}
    overlay.classList.remove('visible');
  }, 1500);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const ls = document.getElementById('loginScreen');
    if (ls.style.display !== 'none' && !ls.classList.contains('hiding')) tryLogin();
  }
});

// ── WELCOME LOGIC ────────────────────────────────────────────────
function updateWelcome(name) {
  const h = new Date().getHours();
  let msg, emoji, sub;
  if (h >= 5 && h < 12)       { msg = 'Bonjour'; emoji = '☀️'; sub = 'Prêt pour le service du midi ?'; }
  else if (h >= 12 && h < 18) { msg = 'Bon après-midi'; emoji = '🌤️'; sub = 'La soirée approche, vérifiez vos stocks !'; }
  else if (h >= 18 && h < 23) { msg = 'Bonsoir'; emoji = '🌙'; sub = 'Service en cours — restez synchronisé !'; }
  else                          { msg = 'Bonne nuit'; emoji = '⭐'; sub = 'Service de nuit — Gamma vous accompagne !'; }
  document.getElementById('welcomeMsg').innerHTML  = `${msg}, <span style="color:var(--teal)">${name}</span> !`;
  document.getElementById('welcomeEmoji').textContent = emoji;
  document.getElementById('welcomeSub').textContent   = sub;
}

// ── INIT ─────────────────────────────────────────────────────────
function initApp() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });
  setupFirestoreListeners();
  loadEquipe();
  renderRecipes();
}

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const pageEl = document.getElementById(page);
  if (pageEl) pageEl.classList.add('active');
  const link = document.querySelector(`[data-page="${page}"]`);
  if (link) link.classList.add('active');
  if (page === 'intelligence') loadIntelligence();
  if (page === 'ventes') renderVentes();
}

// ── FIRESTORE SETUP ──────────────────────────────────────────────
async function setupFirestoreListeners() {
  const db = window._fbDb;
  if (!db) { console.warn('Firestore not available'); return; }
  const { collection, query, orderBy, onSnapshot, limit } = window._fb;

  // Seed stock if empty
  await seedStockIfEmpty();

  // Real-time stock listener
  const stockQ = query(collection(db, 'gamma_stock'), orderBy('nom'));
  _unsubStockListener = onSnapshot(stockQ, snap => {
    cache.stock = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    renderGammaStock();
    updateDashboard();
    updateIntelligenceIfVisible();
  });

  // Real-time notifications listener
  const notifQ = query(collection(db, 'gamma_notifications'), orderBy('createdAt', 'desc'), limit(50));
  _unsubNotifListener = onSnapshot(notifQ, snap => {
    cache.notifications = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    updateNotifBell();
    renderNotifPanel();
  });

  // Real-time activity listener
  const actQ = query(collection(db, 'gamma_activity'), orderBy('timestamp', 'desc'), limit(20));
  _unsubActivityListener = onSnapshot(actQ, snap => {
    cache.activity = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    renderActivityFeed();
  });

  // Real-time ventes listener
  const ventesQ = query(collection(db, 'gamma_ventes'), orderBy('date', 'desc'), limit(100));
  _unsubVentesListener = onSnapshot(ventesQ, snap => {
    cache.ventes = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    renderVentes();
    updateDashboard();
  });
}

async function seedStockIfEmpty() {
  const db = window._fbDb;
  const { collection, getDocs, addDoc, serverTimestamp } = window._fb;
  const snap = await getDocs(collection(db, 'gamma_stock'));
  if (!snap.empty) return;

  const user = window._currentFirebaseUser;
  const by = user ? user.email : 'système';
  const promises = SEED_STOCK.map(item => addDoc(collection(db, 'gamma_stock'), {
    ...item,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: by
  }));
  await Promise.all(promises);
  await logActivity('stock_init', '📦', 'Stock Gamma initialisé avec les données de base', by);
}

// ── DASHBOARD ────────────────────────────────────────────────────
function updateDashboard() {
  const total = cache.stock.length;
  const valeur = cache.stock.reduce((s, p) => s + (p.quantite || 0) * (p.prix || 0), 0);
  const actifs = cache.equipe.filter(e => e.actif).length;
  const alertes = cache.stock.filter(s => s.quantite <= s.quantiteMin).length;
  const critiques = cache.stock.filter(s => s.quantite === 0);

  setEl('d-totalProduits', total || '—');
  setEl('d-valeurStock', total ? formatMoney(valeur) : '—');
  setEl('d-equipe', `${actifs}/${cache.equipe.length}`);
  setEl('d-alertes', alertes || '0');
  setEl('d-criticalBadge', critiques.length);

  // Stock alerts
  const alertStock = cache.stock.filter(s => s.quantite <= s.quantiteMin);
  const alertEl = document.getElementById('d-stockAlerts');
  if (alertEl) {
    if (!alertStock.length) {
      alertEl.innerHTML = '<p style="color:var(--green)">✅ Tous les stocks sont suffisants</p>';
    } else {
      alertEl.innerHTML = alertStock.map(s => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border)">
          <span style="font-weight:500">${GAMMA_CATS[s.categorie]?.emoji || '📦'} ${s.nom}</span>
          <span class="badge ${s.quantite === 0 ? 'badge-red' : 'badge-amber'}">
            ${s.quantite === 0 ? '🚨 Rupture' : `⚠️ ${s.quantite} ${s.unite || ''}`}
          </span>
        </div>`).join('');
    }
  }

  // Top produits (from ventes)
  const topEl = document.getElementById('d-topProduits');
  if (topEl) {
    const counts = {};
    cache.ventes.forEach(v => { counts[v.produit] = (counts[v.produit] || 0) + (v.quantite || 0); });
    const top = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,5);
    if (!top.length) {
      topEl.innerHTML = '<p style="color:var(--muted);font-size:0.9rem">Aucune vente enregistrée</p>';
    } else {
      topEl.innerHTML = `<div class="top-list">${top.map(([n,q],i) => `
        <div class="top-item">
          <div class="top-rank">${i+1}</div>
          <div class="top-name">${n}</div>
          <div class="top-qty">${q} vendus</div>
        </div>`).join('')}</div>`;
    }
  }

  // Equipe resume
  const eqEl = document.getElementById('d-equipeResume');
  if (eqEl) {
    eqEl.innerHTML = cache.equipe.map(e => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border)">
        <span>${e.avatar} <strong>${e.nom}</strong> — ${e.poste}</span>
        <span class="badge ${e.actif ? 'badge-green' : 'badge-red'}">${e.actif ? '✅ Présent' : '❌ Absent'}</span>
      </div>`).join('');
  }
}

function renderActivityFeed() {
  const el = document.getElementById('d-activity');
  if (!el) return;
  if (!cache.activity.length) {
    el.innerHTML = '<p style="color:var(--muted);font-size:0.85rem">Aucune activité récente</p>';
    return;
  }
  el.innerHTML = cache.activity.slice(0,6).map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.icon || '📝'}</div>
      <div class="activity-body">
        <div class="activity-text">${a.description || ''}</div>
        <div class="activity-time">${formatTimeAgo(a.timestamp?.toDate ? a.timestamp.toDate() : new Date())}</div>
      </div>
    </div>`).join('');
}

// ── GAMMA STOCK PAGE ─────────────────────────────────────────────
let activeCat_recipes = 'all';

function setGammaCat(btn, cat) {
  document.querySelectorAll('.gamma-cat-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  gammaActiveCat = cat;
  renderGammaStock();
}

function renderGammaStock() {
  const grid = document.getElementById('gammaGrid');
  if (!grid) return;
  const q = (document.getElementById('gammaSearch')?.value || '').toLowerCase();
  let items = cache.stock;
  if (gammaActiveCat !== 'all') items = items.filter(s => s.categorie === gammaActiveCat);
  if (q) items = items.filter(s => s.nom?.toLowerCase().includes(q));

  if (!items.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">🔍</div>
      <div class="empty-text">${cache.stock.length ? 'Aucun produit trouvé' : 'Chargement du stock…'}</div>
    </div>`;
    return;
  }

  grid.innerHTML = items.map(s => {
    const pct = s.quantiteMin > 0 ? Math.min(100, Math.round(s.quantite / (s.quantiteMin * 2) * 100)) : 50;
    const isCritical = s.quantite === 0;
    const isLow = !isCritical && s.quantite <= s.quantiteMin;
    const stateClass = isCritical ? 'state-critical' : isLow ? 'state-low' : 'state-ok';
    const barColor = isCritical ? 'var(--red)' : isLow ? 'var(--amber)' : 'var(--green)';
    const cat = GAMMA_CATS[s.categorie] || GAMMA_CATS.autre;
    const updBy = s.updatedBy ? s.updatedBy.split('@')[0] : '—';
    const updAt = s.updatedAt?.toDate ? formatTimeAgo(s.updatedAt.toDate()) : '—';

    const invClick = inventoryMode ? `onclick="openInventoryCount('${s._id}','${escHtml(s.nom)}')"` : '';

    return `
    <div class="gamma-card ${stateClass}" ${invClick} style="${inventoryMode ? 'cursor:pointer' : ''}">
      <div class="gamma-card-cat">${cat.emoji} ${cat.label}
        ${isCritical ? '<span class="badge badge-red" style="margin-left:auto">Rupture</span>' :
          isLow ? '<span class="badge badge-amber" style="margin-left:auto">⚠ Faible</span>' : ''}
      </div>
      <div class="gamma-card-name">${escHtml(s.nom)}</div>
      <div class="gamma-qty-row">
        <div class="gamma-qty-val" style="color:${barColor}">${s.quantite ?? 0}</div>
        <div class="gamma-qty-unit">${escHtml(s.unite || 'pièces')}</div>
        <div style="margin-left:auto;font-size:0.78rem;color:var(--muted)">min: ${s.quantiteMin || 0}</div>
      </div>
      <div class="gamma-progress"><div class="gamma-progress-bar" style="width:${pct}%;background:${barColor}"></div></div>
      <div class="gamma-card-meta">
        <span>💰 ${formatMoney(s.prix || 0)}</span>
        <span title="${updAt}">✏️ ${updBy}</span>
      </div>
      ${!inventoryMode ? `
      <div class="gamma-card-actions">
        <button class="qty-btn qty-btn-plus" onclick="quickAddStock('${s._id}',10)" title="+ 10">+10</button>
        <button class="qty-btn qty-btn-plus" onclick="quickAddStock('${s._id}',1)" title="+ 1">+1</button>
        <button class="qty-btn qty-btn-minus" onclick="quickAddStock('${s._id}',-1)" title="- 1">-1</button>
        <button class="btn btn-ghost btn-sm" onclick="openEditStock('${s._id}')" style="margin-left:auto">✏️</button>
        <button class="btn btn-red btn-sm" onclick="deleteStock('${s._id}','${escHtml(s.nom)}')">🗑</button>
      </div>` : ''}
    </div>`;
  }).join('');
}

async function quickAddStock(id, delta) {
  const db = window._fbDb;
  const { doc, updateDoc, serverTimestamp } = window._fb;
  const item = cache.stock.find(s => s._id === id);
  if (!item) return;
  const newQty = Math.max(0, (item.quantite || 0) + delta);
  const user = window._currentFirebaseUser;
  const by = user ? user.email : 'inconnu';

  try {
    await updateDoc(doc(db, 'gamma_stock', id), {
      quantite: newQty,
      updatedAt: serverTimestamp(),
      updatedBy: by
    });
    await logActivity('stock_update', delta > 0 ? '📈' : '📉',
      `<strong>${by.split('@')[0]}</strong> a ${delta > 0 ? 'ajouté' : 'retiré'} ${Math.abs(delta)} × ${item.nom}`, by);

    // Auto-notify if stock drops to/below threshold
    if (newQty <= item.quantiteMin && (item.quantite || 0) > item.quantiteMin) {
      await createNotification(
        newQty === 0 ? 'stock_critical' : 'stock_low',
        newQty === 0 ? `🚨 Rupture de stock : ${item.nom}` : `⚠️ Stock faible : ${item.nom} (${newQty} ${item.unite || ''})`,
        item.nom, by
      );
    }
  } catch(e) { showToast('Erreur de mise à jour', 'error'); }
}

function openAddProduitGamma() {
  openModal('📦', 'Nouveau Produit', `
    <div class="form-group">
      <label class="form-label">Nom du produit *</label>
      <input class="form-ctrl" id="gp_nom" placeholder="ex: Cointreau" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Catégorie *</label>
        <select class="form-ctrl" id="gp_cat">
          ${Object.entries(GAMMA_CATS).filter(([k])=>k!=='all').map(([k,v])=>`<option value="${k}">${v.emoji} ${v.label}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Unité</label>
        <select class="form-ctrl" id="gp_unite">
          <option>bouteilles</option><option>pièces</option><option>cl</option>
          <option>L</option><option>kg</option><option>g</option><option>bottes</option><option>cartons</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Quantité actuelle</label>
        <input class="form-ctrl" id="gp_qty" type="number" min="0" value="0" />
      </div>
      <div class="form-group">
        <label class="form-label">Seuil minimum</label>
        <input class="form-ctrl" id="gp_min" type="number" min="0" value="5" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Prix unitaire (€)</label>
      <input class="form-ctrl" id="gp_prix" type="number" min="0" step="0.01" value="0" />
    </div>
    <div class="form-group">
      <label class="form-label">Fournisseur (optionnel)</label>
      <input class="form-ctrl" id="gp_fournisseur" placeholder="Nom du fournisseur…" />
    </div>
    <button class="btn btn-teal" style="width:100%;margin-top:0.5rem" onclick="saveNewProduit()">✓ Ajouter au stock</button>
  `);
}

async function saveNewProduit() {
  const nom = document.getElementById('gp_nom')?.value.trim();
  if (!nom) { showToast('Nom requis', 'error'); return; }
  const db = window._fbDb;
  const { collection, addDoc, serverTimestamp } = window._fb;
  const user = window._currentFirebaseUser;
  const by = user ? user.email : 'inconnu';
  try {
    await addDoc(collection(db, 'gamma_stock'), {
      nom,
      categorie: document.getElementById('gp_cat').value,
      unite: document.getElementById('gp_unite').value,
      quantite: parseInt(document.getElementById('gp_qty').value) || 0,
      quantiteMin: parseInt(document.getElementById('gp_min').value) || 5,
      prix: parseFloat(document.getElementById('gp_prix').value) || 0,
      fournisseur: document.getElementById('gp_fournisseur').value.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: by
    });
    await logActivity('stock_add', '✅', `<strong>${by.split('@')[0]}</strong> a ajouté <strong>${nom}</strong> au stock`, by);
    closeModal();
    showToast(`${nom} ajouté au stock`, 'success');
  } catch(e) { showToast('Erreur lors de l\'ajout', 'error'); }
}

function openEditStock(id) {
  const s = cache.stock.find(x => x._id === id);
  if (!s) return;
  openModal('✏️', `Modifier : ${s.nom}`, `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Quantité</label>
        <input class="form-ctrl" id="es_qty" type="number" min="0" value="${s.quantite || 0}" />
      </div>
      <div class="form-group">
        <label class="form-label">Seuil minimum</label>
        <input class="form-ctrl" id="es_min" type="number" min="0" value="${s.quantiteMin || 0}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Prix unitaire (€)</label>
      <input class="form-ctrl" id="es_prix" type="number" step="0.01" value="${s.prix || 0}" />
    </div>
    <div class="form-group">
      <label class="form-label">Catégorie</label>
      <select class="form-ctrl" id="es_cat">
        ${Object.entries(GAMMA_CATS).filter(([k])=>k!=='all').map(([k,v])=>`<option value="${k}" ${s.categorie===k?'selected':''}>${v.emoji} ${v.label}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Fournisseur</label>
      <input class="form-ctrl" id="es_fournisseur" value="${escHtml(s.fournisseur || '')}" />
    </div>
    <button class="btn btn-teal" style="width:100%;margin-top:0.5rem" onclick="saveEditStock('${id}','${escHtml(s.nom)}')">✓ Enregistrer</button>
  `);
}

async function saveEditStock(id, nom) {
  const db = window._fbDb;
  const { doc, updateDoc, serverTimestamp } = window._fb;
  const user = window._currentFirebaseUser;
  const by = user ? user.email : 'inconnu';
  const prevItem = cache.stock.find(x => x._id === id);
  const newQty = parseInt(document.getElementById('es_qty').value) || 0;
  try {
    await updateDoc(doc(db, 'gamma_stock', id), {
      quantite: newQty,
      quantiteMin: parseInt(document.getElementById('es_min').value) || 0,
      prix: parseFloat(document.getElementById('es_prix').value) || 0,
      categorie: document.getElementById('es_cat').value,
      fournisseur: document.getElementById('es_fournisseur').value.trim(),
      updatedAt: serverTimestamp(),
      updatedBy: by
    });
    await logActivity('stock_update', '✏️', `<strong>${by.split('@')[0]}</strong> a modifié <strong>${nom}</strong>`, by);
    // Notify if below threshold
    if (prevItem && newQty <= prevItem.quantiteMin && prevItem.quantite > prevItem.quantiteMin) {
      await createNotification(newQty === 0 ? 'stock_critical' : 'stock_low',
        newQty === 0 ? `🚨 Rupture : ${nom}` : `⚠️ Stock faible : ${nom} (${newQty})`, nom, by);
    }
    closeModal();
    showToast(`${nom} mis à jour`, 'success');
  } catch(e) { showToast('Erreur de sauvegarde', 'error'); }
}

async function deleteStock(id, nom) {
  if (!confirm(`Supprimer "${nom}" du stock ?`)) return;
  const db = window._fbDb;
  const { doc, deleteDoc, serverTimestamp } = window._fb;
  const user = window._currentFirebaseUser;
  const by = user ? user.email : 'inconnu';
  try {
    await deleteDoc(doc(db, 'gamma_stock', id));
    await logActivity('stock_delete', '🗑', `<strong>${by.split('@')[0]}</strong> a supprimé <strong>${nom}</strong>`, by);
    showToast(`${nom} supprimé`, 'error');
  } catch(e) { showToast('Erreur de suppression', 'error'); }
}

// ── INVENTORY MODE ───────────────────────────────────────────────
function toggleInventoryMode() {
  inventoryMode = !inventoryMode;
  const banner = document.getElementById('invBanner');
  const btn = document.getElementById('invModeBtn');
  if (inventoryMode) {
    banner.classList.add('show');
    btn.textContent = '⬅ Quitter inventaire';
    btn.classList.add('btn-gold');
    showToast('Mode inventaire activé — cliquez sur un produit', 'info');
  } else {
    banner.classList.remove('show');
    btn.textContent = '📋 Mode inventaire';
    btn.classList.remove('btn-gold');
  }
  renderGammaStock();
}

function openInventoryCount(id, nom) {
  const s = cache.stock.find(x => x._id === id);
  if (!s) return;
  openModal('📋', `Inventaire : ${nom}`, `
    <p style="color:var(--muted);margin-bottom:1rem;font-size:0.9rem">Stock actuel : <strong style="color:var(--teal)">${s.quantite} ${s.unite || ''}</strong></p>
    <div class="form-group">
      <label class="form-label">Quantité comptée réelle</label>
      <input class="form-ctrl" id="inv_qty" type="number" min="0" value="${s.quantite || 0}" style="font-size:1.5rem;text-align:center;" />
    </div>
    <div class="form-group">
      <label class="form-label">Note (optionnel)</label>
      <input class="form-ctrl" id="inv_note" placeholder="ex: bouteille entamée…" />
    </div>
    <button class="btn btn-gold" style="width:100%;margin-top:0.5rem" onclick="saveInventoryCount('${id}','${escHtml(nom)}')">✓ Valider le comptage</button>
  `);
}

async function saveInventoryCount(id, nom) {
  const qty = parseInt(document.getElementById('inv_qty').value);
  if (isNaN(qty) || qty < 0) { showToast('Quantité invalide', 'error'); return; }
  const note = document.getElementById('inv_note').value.trim();
  const db = window._fbDb;
  const { doc, updateDoc, serverTimestamp } = window._fb;
  const user = window._currentFirebaseUser;
  const by = user ? user.email : 'inconnu';
  const prevItem = cache.stock.find(x => x._id === id);
  try {
    await updateDoc(doc(db, 'gamma_stock', id), {
      quantite: qty, updatedAt: serverTimestamp(), updatedBy: by
    });
    const noteStr = note ? ` (${note})` : '';
    await logActivity('stock_inventory', '📋',
      `<strong>${by.split('@')[0]}</strong> a inventorié <strong>${nom}</strong> : ${qty} ${prevItem?.unite || ''}${noteStr}`, by);
    if (qty <= (prevItem?.quantiteMin || 0) && (prevItem?.quantite || 0) > (prevItem?.quantiteMin || 0)) {
      await createNotification(qty === 0 ? 'stock_critical' : 'stock_low',
        qty === 0 ? `🚨 Rupture constatée : ${nom}` : `⚠️ Stock faible inventorié : ${nom} (${qty})`, nom, by);
    }
    closeModal();
    showToast(`${nom} inventorié : ${qty} ${prevItem?.unite || ''}`, 'success');
  } catch(e) { showToast('Erreur', 'error'); }
}

// ── NOTIFICATIONS ────────────────────────────────────────────────
async function createNotification(type, message, produit, createdBy) {
  const db = window._fbDb;
  const { collection, addDoc, serverTimestamp } = window._fb;
  try {
    await addDoc(collection(db, 'gamma_notifications'), {
      type, message, produit: produit || null, createdBy,
      createdAt: serverTimestamp(), readBy: []
    });
  } catch(e) { console.error('Notification error', e); }
}

function updateNotifBell() {
  const user = window._currentFirebaseUser;
  const email = user ? user.email : '';
  const unread = cache.notifications.filter(n => !n.readBy?.includes(email));
  const badge = document.getElementById('notifBadge');
  if (unread.length > 0) {
    badge.textContent = unread.length > 9 ? '9+' : unread.length;
    badge.classList.add('show');
  } else {
    badge.classList.remove('show');
  }
}

function renderNotifPanel() {
  const list = document.getElementById('notifList');
  if (!list) return;
  const user = window._currentFirebaseUser;
  const email = user ? user.email : '';
  if (!cache.notifications.length) {
    list.innerHTML = '<div class="notif-empty">🔔 Aucune notification</div>';
    return;
  }
  const icons = { stock_low:'⚠️', stock_critical:'🚨', team_message:'💬', order:'📦' };
  list.innerHTML = cache.notifications.map(n => {
    const unread = !n.readBy?.includes(email);
    const ts = n.createdAt?.toDate ? n.createdAt.toDate() : new Date();
    return `
    <div class="notif-item ${unread ? 'unread' : ''}" onclick="markNotifRead('${n._id}')">
      <div class="notif-item-header">
        <span class="notif-item-title">${icons[n.type] || '🔔'} ${n.type === 'stock_low' ? 'Stock faible' : n.type === 'stock_critical' ? 'Stock critique' : n.type === 'team_message' ? 'Message équipe' : 'Gamma'}</span>
        <span class="notif-item-time">${formatTimeAgo(ts)}</span>
      </div>
      <div class="notif-item-msg">${n.message || ''}</div>
    </div>`;
  }).join('');
}

function toggleNotifPanel() {
  const panel = document.getElementById('notifPanel');
  const overlay = document.getElementById('notifOverlay');
  panel.classList.toggle('open');
  overlay.classList.toggle('active');
}

async function markNotifRead(id) {
  const db = window._fbDb;
  const { doc, updateDoc } = window._fb;
  const user = window._currentFirebaseUser;
  const email = user ? user.email : '';
  const n = cache.notifications.find(x => x._id === id);
  if (!n || n.readBy?.includes(email)) return;
  try {
    const newReadBy = [...(n.readBy || []), email];
    await updateDoc(doc(db, 'gamma_notifications', id), { readBy: newReadBy });
  } catch(e) {}
}

async function markAllRead() {
  const db = window._fbDb;
  const { doc, updateDoc } = window._fb;
  const user = window._currentFirebaseUser;
  const email = user ? user.email : '';
  const unread = cache.notifications.filter(n => !n.readBy?.includes(email));
  await Promise.all(unread.map(n =>
    updateDoc(doc(db, 'gamma_notifications', n._id), { readBy: [...(n.readBy || []), email] })
  ));
  showToast('Toutes les notifications marquées comme lues', 'info');
}

async function clearAllNotifs() {
  if (!confirm('Effacer toutes les notifications ?')) return;
  const db = window._fbDb;
  const { doc, deleteDoc } = window._fb;
  await Promise.all(cache.notifications.map(n => deleteDoc(doc(db, 'gamma_notifications', n._id))));
  showToast('Notifications effacées', 'info');
}

// ── ACTIVITY LOG ─────────────────────────────────────────────────
async function logActivity(type, icon, description, user) {
  const db = window._fbDb;
  const { collection, addDoc, serverTimestamp } = window._fb;
  try {
    await addDoc(collection(db, 'gamma_activity'), {
      type, icon, description, user, timestamp: serverTimestamp()
    });
  } catch(e) {}
}

// ── INTELLIGENCE PAGE ────────────────────────────────────────────
function loadIntelligence() {
  renderStockScore();
  renderReorderSuggestions();
  renderConsumptionChart();
  renderTopConsumed();
}

function updateIntelligenceIfVisible() {
  const page = document.getElementById('intelligence');
  if (page && page.classList.contains('active')) loadIntelligence();
}

function renderStockScore() {
  const total = cache.stock.length;
  if (!total) return;
  const ok = cache.stock.filter(s => s.quantite > s.quantiteMin).length;
  const score = Math.round((ok / total) * 100);
  const el = document.getElementById('scoreValue');
  if (el) el.textContent = score;
  const ring = document.getElementById('scoreRing');
  if (ring) {
    const color = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)';
    ring.style.borderColor = color;
    ring.style.background = score >= 80 ? 'rgba(16,185,129,0.06)' : score >= 50 ? 'rgba(255,159,67,0.06)' : 'rgba(239,68,68,0.06)';
  }
  const lbl = document.getElementById('scoreLabel');
  if (lbl) lbl.textContent = score >= 80 ? '✅ Stock en bonne santé' : score >= 50 ? '⚠️ Quelques manques' : '🚨 Stock critique — action requise';
}

function renderReorderSuggestions() {
  const el = document.getElementById('reorderList');
  if (!el) return;
  const low = cache.stock.filter(s => s.quantite <= s.quantiteMin * 1.5).sort((a,b) => a.quantite - b.quantite);
  if (!low.length) {
    el.innerHTML = '<p style="color:var(--green)">✅ Aucun réapprovisionnement nécessaire</p>'; return;
  }
  el.innerHTML = low.map(s => {
    const ratio = s.quantiteMin > 0 ? (s.quantite / s.quantiteMin) : 1;
    const urgency = ratio === 0 ? 'critical' : ratio < 0.5 ? 'warning' : 'ok';
    const labelMap = { critical:'Rupture totale', warning:'Urgent', ok:'Bientôt' };
    const suggest = Math.max(s.quantiteMin * 3, 1);
    return `
    <div class="reorder-item">
      <div class="reorder-left">
        <div class="reorder-name">${GAMMA_CATS[s.categorie]?.emoji || '📦'} ${escHtml(s.nom)}</div>
        <div class="reorder-sub">Actuel : ${s.quantite} ${s.unite || ''} · Min : ${s.quantiteMin} · Suggéré : <strong>+${suggest}</strong></div>
      </div>
      <span class="days-pill days-${urgency}">${labelMap[urgency]}</span>
      <button class="btn btn-teal btn-sm" style="margin-left:0.5rem" onclick="createOrderNotif('${escHtml(s.nom)}',${suggest})">Commander</button>
    </div>`;
  }).join('');
}

async function createOrderNotif(nom, qty) {
  const user = window._currentFirebaseUser;
  const by = user ? user.email : 'inconnu';
  await createNotification('order', `📦 Commande suggérée : ${qty}× ${nom} — initiée par ${by.split('@')[0]}`, nom, by);
  await logActivity('order', '📦', `<strong>${by.split('@')[0]}</strong> a initié une commande de <strong>${qty}× ${nom}</strong>`, by);
  showToast(`Commande de ${qty}× ${nom} notifiée à l'équipe`, 'success');
}

function renderConsumptionChart() {
  const canvas = document.getElementById('consumptionChart');
  if (!canvas) return;
  if (consumptionChart) { consumptionChart.destroy(); consumptionChart = null; }

  // Build last 7 days labels
  const days = [];
  const dayLabels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toDateString());
    dayLabels.push(d.toLocaleDateString('fr-FR', { weekday:'short', day:'numeric' }));
  }

  // Aggregate ventes by day
  const dailyTotals = days.map(day =>
    cache.ventes.filter(v => {
      const vd = v.date?.toDate ? v.date.toDate() : new Date(v.date);
      return vd.toDateString() === day;
    }).reduce((s, v) => s + (v.total || v.quantite * v.prix || 0), 0)
  );

  consumptionChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: dayLabels,
      datasets: [{
        label: 'CA journalier (€)',
        data: dailyTotals,
        backgroundColor: 'rgba(0,210,200,0.3)',
        borderColor: 'rgba(0,210,200,0.8)',
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)', font: { size: 11 },
          callback: v => v + '€' } }
      }
    }
  });
}

function renderTopConsumed() {
  const el = document.getElementById('topConsumed');
  if (!el) return;
  const counts = {};
  cache.ventes.forEach(v => { counts[v.produit] = (counts[v.produit] || 0) + (v.quantite || 0); });
  const top = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,6);
  if (!top.length) { el.innerHTML = '<p style="color:var(--muted)">Pas encore de ventes</p>'; return; }
  const max = top[0][1];
  el.innerHTML = top.map(([n,q],i) => `
    <div style="margin-bottom:0.7rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:0.3rem">
        <span style="font-size:0.85rem;font-weight:500">${i+1}. ${n}</span>
        <span style="font-size:0.8rem;color:var(--muted)">${q} ventes</span>
      </div>
      <div style="height:4px;border-radius:2px;background:rgba(255,255,255,0.08);overflow:hidden">
        <div style="height:100%;border-radius:2px;width:${Math.round(q/max*100)}%;background:linear-gradient(90deg,var(--teal),var(--violet))"></div>
      </div>
    </div>`).join('');
}

async function sendBroadcast() {
  const msg = document.getElementById('broadcastMsg')?.value.trim();
  if (!msg) { showToast('Message vide', 'error'); return; }
  const user = window._currentFirebaseUser;
  const by = user ? user.email : 'inconnu';
  await createNotification('team_message', `💬 ${by.split('@')[0]} : ${msg}`, null, by);
  await logActivity('team', '💬', `<strong>${by.split('@')[0]}</strong> a diffusé : "${msg}"`, by);
  document.getElementById('broadcastMsg').value = '';
  showToast('Message diffusé à toute l\'équipe !', 'success');
}

// ── VENTES ───────────────────────────────────────────────────────
function renderVentes() {
  const tbody = document.getElementById('ventesBody');
  if (!tbody) return;
  const total = cache.ventes.reduce((s,v) => s + (v.total || 0), 0);
  setEl('ventesTotal', formatMoney(total));

  if (!cache.ventes.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">💰</div><div class="empty-text">Aucune vente enregistrée</div></div></td></tr>`;
    return;
  }
  tbody.innerHTML = cache.ventes.map(v => {
    const date = v.date?.toDate ? v.date.toDate() : new Date(v.date || Date.now());
    return `<tr>
      <td style="color:var(--muted)">${formatDate(date)}</td>
      <td><strong>${escHtml(v.produit)}</strong></td>
      <td>${v.quantite}</td>
      <td>${formatMoney(v.prix || 0)}</td>
      <td><strong style="color:var(--gold)">${formatMoney(v.total || 0)}</strong></td>
      <td style="color:var(--muted);font-size:0.8rem">${v.user ? v.user.split('@')[0] : '—'}</td>
      <td><button class="btn btn-red btn-sm" onclick="deleteVente('${v._id}')">🗑</button></td>
    </tr>`;
  }).join('');
}

function openAddVente() {
  const options = cache.stock.map(s => `<option value="${escHtml(s.nom)}" data-prix="${s.prix}" data-id="${s._id}">${escHtml(s.nom)} (${formatMoney(s.prix || 0)})</option>`).join('');
  openModal('💰', 'Nouvelle Vente', `
    <div class="form-group">
      <label class="form-label">Produit</label>
      <select class="form-ctrl" id="v_produit" onchange="updateVentePrix()">${options}</select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Quantité *</label>
        <input class="form-ctrl" id="v_qty" type="number" min="1" value="1" oninput="updateVenteTotal()" />
      </div>
      <div class="form-group">
        <label class="form-label">Prix unit. (€)</label>
        <input class="form-ctrl" id="v_prix" type="number" step="0.01" value="0" oninput="updateVenteTotal()" />
      </div>
    </div>
    <div style="background:rgba(0,210,200,0.07);border:1px solid rgba(0,210,200,0.2);border-radius:10px;padding:0.8rem;text-align:center;margin-bottom:1rem">
      <div style="color:var(--muted);font-size:0.8rem">Total</div>
      <div id="v_total" style="font-family:'Playfair Display',serif;font-size:1.8rem;color:var(--teal)">0,00 €</div>
    </div>
    <button class="btn btn-teal" style="width:100%" onclick="saveVente()">✓ Enregistrer la vente</button>
  `);
  setTimeout(updateVentePrix, 50);
}

function updateVentePrix() {
  const sel = document.getElementById('v_produit');
  const opt = sel?.options[sel.selectedIndex];
  if (opt) {
    document.getElementById('v_prix').value = opt.dataset.prix || 0;
    updateVenteTotal();
  }
}

function updateVenteTotal() {
  const qty = parseFloat(document.getElementById('v_qty')?.value) || 0;
  const prix = parseFloat(document.getElementById('v_prix')?.value) || 0;
  const el = document.getElementById('v_total');
  if (el) el.textContent = formatMoney(qty * prix);
}

async function saveVente() {
  const sel = document.getElementById('v_produit');
  const opt = sel?.options[sel.selectedIndex];
  const qty = parseInt(document.getElementById('v_qty')?.value) || 0;
  const prix = parseFloat(document.getElementById('v_prix')?.value) || 0;
  if (!sel?.value || qty < 1) { showToast('Données invalides', 'error'); return; }
  const produit = sel.value;
  const stockId = opt?.dataset.id;
  const user = window._currentFirebaseUser;
  const by = user ? user.email : 'inconnu';
  const db = window._fbDb;
  const { collection, addDoc, doc, updateDoc, serverTimestamp } = window._fb;
  try {
    await addDoc(collection(db, 'gamma_ventes'), {
      produit, quantite: qty, prix, total: qty * prix,
      date: serverTimestamp(), user: by
    });
    // Deduct from stock
    if (stockId) {
      const s = cache.stock.find(x => x._id === stockId);
      if (s) {
        const newQty = Math.max(0, (s.quantite || 0) - qty);
        await updateDoc(doc(db, 'gamma_stock', stockId), {
          quantite: newQty, updatedAt: serverTimestamp(), updatedBy: by
        });
        if (newQty <= s.quantiteMin && (s.quantite || 0) > s.quantiteMin) {
          await createNotification(newQty === 0 ? 'stock_critical' : 'stock_low',
            newQty === 0 ? `🚨 Rupture après vente : ${produit}` : `⚠️ Stock faible après vente : ${produit} (${newQty} ${s.unite || ''})`,
            produit, by);
        }
      }
    }
    await logActivity('vente', '💰', `<strong>${by.split('@')[0]}</strong> a vendu ${qty}× <strong>${produit}</strong> (${formatMoney(qty*prix)})`, by);
    closeModal();
    showToast(`Vente enregistrée : ${qty}× ${produit}`, 'success');
  } catch(e) { showToast('Erreur lors de l\'enregistrement', 'error'); }
}

async function deleteVente(id) {
  if (!confirm('Supprimer cette vente ?')) return;
  const db = window._fbDb;
  const { doc, deleteDoc } = window._fb;
  try {
    await deleteDoc(doc(db, 'gamma_ventes', id));
    showToast('Vente supprimée', 'error');
  } catch(e) { showToast('Erreur', 'error'); }
}

// ── ÉQUIPE ───────────────────────────────────────────────────────
function loadEquipe() {
  const grid = document.getElementById('equipeGrid');
  if (!grid) return;
  grid.innerHTML = cache.equipe.map(e => `
    <div class="member-card" style="border-color:${e.actif ? 'rgba(16,185,129,0.2)' : 'var(--border)'}">
      <div class="member-avatar" style="background:${e.actif ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}">${e.avatar}</div>
      <div class="member-name">${escHtml(e.nom)}</div>
      <div class="member-role">${escHtml(e.poste)}</div>
      <div class="member-hours">🕐 ${escHtml(e.horaire)}</div>
      <span class="badge ${e.actif ? 'badge-green' : 'badge-red'}" style="margin-bottom:1rem">${e.actif ? '✅ Présent' : '❌ Absent'}</span>
      <div style="display:flex;gap:0.4rem;justify-content:center">
        <button class="btn btn-ghost btn-sm" onclick="togglePresence(${e.id})">${e.actif ? 'Marquer absent' : 'Marquer présent'}</button>
        <button class="btn btn-red btn-sm" onclick="delMembre(${e.id})">🗑</button>
      </div>
    </div>`).join('');
  updateDashboard();
}

function togglePresence(id) {
  const m = cache.equipe.find(e => e.id === id);
  if (!m) return;
  m.actif = !m.actif;
  loadEquipe();
  const user = window._currentFirebaseUser;
  const by = user ? user.email : 'inconnu';
  logActivity('team', m.actif ? '✅' : '❌', `<strong>${by.split('@')[0]}</strong> a marqué <strong>${m.nom}</strong> ${m.actif ? 'présent' : 'absent'}`, by);
  showToast(`${m.nom} : ${m.actif ? 'présent ✅' : 'absent ❌'}`, 'info');
}

function delMembre(id) {
  if (!confirm('Supprimer ce membre ?')) return;
  cache.equipe = cache.equipe.filter(e => e.id !== id);
  loadEquipe();
  showToast('Membre supprimé', 'error');
}

function openAddMembre() {
  openModal('👥', 'Nouveau Membre', `
    <div class="form-group">
      <label class="form-label">Nom complet *</label>
      <input class="form-ctrl" id="m_nom" placeholder="ex: Marie Dupont" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Poste</label>
        <select class="form-ctrl" id="m_poste">
          <option>Barman</option><option>Serveuse</option><option>Serveur</option>
          <option>Manager</option><option>Chef de rang</option><option>Commis</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Horaires</label>
        <input class="form-ctrl" id="m_horaire" placeholder="ex: 18h-02h" />
      </div>
    </div>
    <button class="btn btn-teal" style="width:100%;margin-top:0.5rem" onclick="saveMembre()">✓ Ajouter</button>
  `);
}

function saveMembre() {
  const nom = document.getElementById('m_nom')?.value.trim();
  if (!nom) { showToast('Nom requis', 'error'); return; }
  const avatars = ['👨‍🍳','👩‍🍳','👨‍💼','👩‍💼','🧑‍🍳','🧑‍💼'];
  cache.equipe.push({
    id: Date.now(),
    nom,
    poste: document.getElementById('m_poste').value,
    actif: true,
    horaire: document.getElementById('m_horaire').value.trim() || 'À définir',
    avatar: avatars[Math.floor(Math.random() * avatars.length)]
  });
  closeModal();
  loadEquipe();
  showToast(`${nom} ajouté à l'équipe`, 'success');
}

// ── RECETTES ─────────────────────────────────────────────────────
let activeCatRecettes = 'all';

function setCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCatRecettes = cat;
  renderRecipes();
}

function filterRecettes() { renderRecipes(); }

function renderRecipes() {
  const q = (document.getElementById('recetteSearch')?.value || '').toLowerCase();
  const filtered = RECIPES.filter(r => {
    const catOk = activeCatRecettes === 'all' || r.category === activeCatRecettes;
    const searchOk = !q || r.name.toLowerCase().includes(q) || r.ingredients.some(i => i.toLowerCase().includes(q));
    return catOk && searchOk;
  });
  const grid = document.getElementById('recipesGrid');
  if (!grid) return;
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><div class="empty-text">Aucune recette trouvée</div></div>`;
    return;
  }
  grid.innerHTML = filtered.map((r, i) => `
    <div class="recipe-card" onclick="openRecipe(${r.id})" style="animation-delay:${i*0.03}s">
      <div class="recipe-thumb" style="background:${CAT_BG[r.category] || 'rgba(255,255,255,0.04)'}">
        <span>${CAT_EMOJI[r.category] || '🍽️'}</span>
      </div>
      <div class="recipe-body">
        <div class="recipe-name">${r.name}</div>
        <div class="recipe-meta">
          <span class="badge" style="background:${CAT_BG[r.category]};color:${CAT_COLOR[r.category]}">${CAT_LABEL[r.category] || r.category}</span>
          <span class="recipe-count">${r.ingredients.length} ingr.</span>
        </div>
      </div>
    </div>`).join('');
}

function openRecipe(id) {
  const r = RECIPES.find(x => x.id === id);
  if (!r) return;
  openModal(CAT_EMOJI[r.category] || '🍽️', r.name, `
    <p class="section-title">Ingrédients (${r.ingredients.length})</p>
    <div class="ingredient-list">
      ${r.ingredients.map(ing => `<div class="ingredient-item"><div class="ing-dot"></div>${ing}</div>`).join('')}
    </div>
    <p class="section-title">Préparation (${r.steps.length} étapes)</p>
    <div class="steps-list">
      ${r.steps.map((s,i) => `<div class="step-item"><div class="step-num">${i+1}</div><div>${s}</div></div>`).join('')}
    </div>
    <div style="margin-top:1rem">
      <span class="badge" style="background:${CAT_BG[r.category]};color:${CAT_COLOR[r.category]}">${CAT_EMOJI[r.category]} ${CAT_LABEL[r.category]}</span>
    </div>
  `);
}

// ── MODAL ────────────────────────────────────────────────────────
function openModal(emoji, title, body) {
  document.getElementById('modalEmoji').textContent = emoji;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

// ── TOAST ─────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span>`;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => { toast.classList.add('leaving'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ── HELPERS ───────────────────────────────────────────────────────
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function formatMoney(v) {
  return new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR' }).format(v || 0);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
}

function formatTimeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)   return 'à l\'instant';
  if (diff < 3600) return `il y a ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff/3600)}h`;
  return `il y a ${Math.floor(diff/86400)}j`;
}

function escHtml(str) {
  return String(str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
