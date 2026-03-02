// ══════════════════════════════════════════════════════════════
// BAR MANAGER PRO - app.js
// Application de gestion de bar professionnelle
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════
// DONNÉES DE L'APPLICATION
// ══════════════════════════════════════════
let activeCat = 'all';
let appData = {
ventes: [
{ id: 1, produit: 'Mojito', quantite: 15, prix: 8, date: new Date() },
{ id: 2, produit: 'Bière Pression', quantite: 25, prix: 5, date: new Date() },
{ id: 3, produit: 'Whisky', quantite: 8, prix: 12, date: new Date() },
{ id: 4, produit: 'Coca-Cola', quantite: 20, prix: 3, date: new Date() },
{ id: 5, produit: 'Vin Rouge', quantite: 10, prix: 6, date: new Date() }
],
stock: [
{ id: 1, produit: 'Mojito', quantite: 50, quantiteMin: 20, prix: 8 },
{ id: 2, produit: 'Bière Pression', quantite: 100, quantiteMin: 30, prix: 5 },
{ id: 3, produit: 'Whisky', quantite: 15, quantiteMin: 10, prix: 12 },
{ id: 4, produit: 'Coca-Cola', quantite: 80, quantiteMin: 40, prix: 3 },
{ id: 5, produit: 'Vin Rouge', quantite: 25, quantiteMin: 15, prix: 6 },
{ id: 6, produit: 'Prosecco', quantite: 12, quantiteMin: 10, prix: 9 },
{ id: 7, produit: 'Gin', quantite: 8, quantiteMin: 10, prix: 14 },
{ id: 8, produit: 'Vodka', quantite: 20, quantiteMin: 15, prix: 11 }
],
equipe: [
{ id: 1, nom: 'Jean Dupont', poste: 'Barman', actif: true, horaire: '18h-02h', avatar: '👨‍🍳' },
{ id: 2, nom: 'Marie Martin', poste: 'Serveuse', actif: true, horaire: '20h-04h', avatar: '👩‍💼' },
{ id: 3, nom: 'Pierre Durand', poste: 'Manager', actif: true, horaire: '17h-01h', avatar: '👨‍💼' },
{ id: 4, nom: 'Sophie Bernard', poste: 'Serveuse', actif: false, horaire: '18h-02h', avatar: '👩‍🍳' }
]
};
// Constantes pour les recettes
const RECIPES = [
{"id":1,"name":"Gin tonic pêche","ingredients":["4cl de gin","Tonic peche et sureau","2 tranches de Citron jaune","une branche de romarin","2 tranches de peche","baie de genievre","2cl de crème de peche"],"steps":["Mettre les glaçons Dans le verre et le citron et une tranche de peche","Verser le gin et le tonic et la crème de peche","mélanger rapidement","Décorer d'une tranche de peche et d'une branche de romarin","Ecraser qq baies de genievre et les poser dessus"],"category":"cocktail"},
{"id":2,"name":"Kim Long","ingredients":["1,5cl de sirop de rose","2cl de soho","15cl de jus de litchi","15cl de prosecco","3 petale de rose","1 branche de bamboo"],"steps":["Mettre les glaçons","Mettre l' alcool et le sirop","Verser le jus et le prosecco","planter la feuille de bamboo et poser sur la feuille des pétales"],"category":"cocktail"},
{"id":3,"name":"Mise au vert","ingredients":["8cl de cordial concombre verveine menthe","1cl de citron","10cl de lillet blanc","2cl de st germain","1 tranche de concombre","1 tete de menthe","1 dash de tonic","1cl de sirop de fleur sureau"],"steps":["remplir le verre de glacons","Mettre le cordial, le citron, le lillet et le st germain","toper de badoit et mélanger un peu","Décorer avec la tranche de concombre et la menthe"],"category":"cocktail"},
{"id":4,"name":"Shinzo","ingredients":["3cl de purée de fruits rouges","1cl de citron","1cl de yuzu","2cl de sirop de pasteque","1cl de sirop d'agave","1 poignée de pasteque","1cl de mezcal","4cl de tequila","2 feuilles de shizo"],"steps":["piler la pasteque et 1 feuille de shizo dans le shaker","shaker les sirop, les alcools, les citrons et la purée","verser dans un verre remplis de glacons","décorer d'une feuille de shizo"],"category":"cocktail"},
{"id":5,"name":"Sticky rice","ingredients":["5cl de Rhum","3cl de purée de mangue","1cl de citron vert","zeste citron vert et poudre piment","1cl de sirop de vanille","1cl de sirop de fleur de sureau","5cl de lait de coco infusé au riz","feuille de riz crispy"],"steps":["Shaker tous les éléments avec glacons","verser dans le verre","Décorer d'un zeste de citron vert","Poser la feuille de riz","zester du citron vert et saupoudrer du piment"],"category":"cocktail"},
{"id":6,"name":"Viet Mûle","ingredients":["5cl de vodka","2cl de citron vert","1cl de sucre","Mousse gingembre","1 pincée de basilic","zeste de citron","Badoit rouge","Romarin"],"steps":["Mettre tous les ingrédients sauf la mousse dans un shaker pleins de glaçons et shaker","Shaker","Filtrer et verser dans un verre Caipi pleins de glacons","Remplir de badoit","Toper de mousse","zester du citron vert et mettez des feuilles de romarin"],"category":"cocktail"},
{"id":7,"name":"Petit rouge","ingredients":["10cl de granité","3cl de purée de fruits rouge","1cl de sirop de pasteque","4cl de vodka","1 feuille de bamboo déco","2cl de jus de pasteque"],"steps":["Verser la granité dans le verre.","Ajouter les purées, le sirop et la vodka","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},
{"id":8,"name":"Petit jaune","ingredients":["10cl de granité","2cl de purée de fruit de la passion","4cl de rhum","1 feuille de bamboo"],"steps":["Verser la granité dans le verre.","Ajouter la purée de passion et le rhum.","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},
{"id":9,"name":"Petit vert","ingredients":["10cl de granité","4cl de gin","1,5cl de purée de concombre","3cl de ginger beer","1 feuille de bamboo déco"],"steps":["Verser la granité dans un verre.","Ajouter les liquides","Mélanger et toper à la glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},
{"id":10,"name":"Petit bleu","ingredients":["10cl de granité","2cl de coco","1cl de curacao","4cl de rhum","2cl de jus d'ananas","1 feuille de bamboo"],"steps":["Verser la granité dans le verre.","Ajouter le coco, le curaçao et le rhum et l'ananas","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},
{"id":11,"name":"Petit Force Orange","ingredients":["10cl de granité","4cl de Vodka Eristoff","1,5cl de purée de mangue","2cl de brisure de framboise","Une feuille de bamboo"],"steps":["Verser la granité dans un verre.","Ajouter la purée de mangue, la framboise et la vodka.","Mélanger et toper à la glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},
{"id":12,"name":"Force rouge","ingredients":["20cl de granité","4cl de purée de fruit rouge","4cl de jus de pasteque","6cl de vodka","2cl de sirop de pasteque","1 feuille de bamboo déco"],"steps":["Verser la granité dans le verre.","Ajouter les purées et sirops et la vodka","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},
{"id":13,"name":"Force jaune","ingredients":["20cl de granité","4cl de purée de fruit de la passion","6cl de rhum","1 feuille de bamboo"],"steps":["Verser la granité dans le verre.","Ajouter la purée de passion et le rhum.","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},
{"id":14,"name":"Force verte","ingredients":["20cl de granité","6cl de gin","4cl de purée de concombre","4cl de ginger beer","1 feuille de bamboo déco"],"steps":["Verser la granité dans un verre.","Ajouter la purée et le gin, et le ginger beer","Mélanger et toper à la glace pilée.","Décorer de la feuille de bamboo et d'un citron deshydraté"],"category":"force"},
{"id":15,"name":"Force bleue","ingredients":["20cl de granité","4cl de coco","2cl de curacao","6cl de rhum","4cl de jus d'ananas","1 feuille de bamboo"],"steps":["Verser la granité dans le verre.","Ajouter la coco, le curaçao et le rhum.","Mélanger et toper de glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},
{"id":16,"name":"Force orange","ingredients":["20cl de granité","6cl de Vodka Eristoff","2cl de purée de mangue","3cl de purée de fruits rouges","Une feuille de bamboo"],"steps":["Verser la granité dans un verre.","Ajouter la purée de mangue, la framboise et la vodka.","Mélanger et toper à la glace pilée.","Décorer d'une feuille de bamboo et d'un citron deshydraté"],"category":"force"},
{"id":17,"name":"Smoothie mangue coco","ingredients":["150gr de glace pilée","75gr de purée de mangue","75gr de jus d'ananas","150gr de purée de coco","2cl de sucre de canne","1 citron déshydraté"],"steps":["mettre les ingrédients dans le blender","mixer et verser dans le verre","Décorer d'une tranche de citron déshydraté"],"category":"smoothie"},
{"id":18,"name":"Smoothie mangue basilic","ingredients":["150gr de glace pilée","100gr de purée de mangue","3cl de lait concentré sucrée","3 feuilles de basilic","100gr de jus de mangue","2cl de sucre de canne"],"steps":["mettre les ingrédients dans le blender","mixer et verser dans le verre","Décorer d'une tranche de citron déshydraté"],"category":"smoothie"},
{"id":19,"name":"Smoothie fruits rouge acai","ingredients":["150gr de glace pilée","150gr de purée de fruits rouge","150gr de jus de canneberge","4gr de purée d'acai","4cl de sucre de canne","1 citron déshydraté"],"steps":["mettre les ingrédients dans le blender","mixer et verser dans le verre","Décorer d'une tranche de citron déshydraté"],"category":"smoothie"},
{"id":20,"name":"Smoothie melon","ingredients":["150gr de glace pilée","300gr de purée de melon","4 feuilles de menthe","2cl de jus de citron","1 citron déshydraté + tete menthe déco"],"steps":["mettre les ingrédients dans le blender","mixer et verser dans le verre","Décorer d'une tranche de citron déshydraté"],"category":"smoothie"},
{"id":21,"name":"Smoothie pastèque","ingredients":["150gr de glace pilée","150gr de purée de fruits rouge","200gr de purée de pastèque","4cl de sirop de pastèque","2cl de sucre de canne","1 citron déshydraté + feuille bambou"],"steps":["mettre les ingrédients dans le blender","mixer et verser dans le verre","Décorer d'une tranche de citron déshydraté"],"category":"smoothie"},
{"id":22,"name":"Bubble Vai","ingredients":["1 louche de bille passion","1cl de citron","jus de litchi","1 tranche de citron vert"],"steps":["Mettre la louche de bille dans le verre.","Le remplir de glacons.","Toper au jus de litchi et décorer d'une tranche de citron vert."],"category":"bubble_tea"},
{"id":23,"name":"Bubble Mojito","ingredients":["1 louche de bille citron vert","2 dès de citron vert","1 pincée de menthe","limonade","1 tête de menthe"],"steps":["Mettre les citron vert et les piler","Ajouter les billes et la menthe","Remplir de glacons","Toper de limonade","Mélanger rapidement et décorer d'une tête de menthe"],"category":"bubble_tea"},
{"id":24,"name":"Bubble Tea Dragon","ingredients":["1 louche de perles fruit du dragon","2cl de purée de passion","18cl de thé Earl Grey froid","2cl de sucre de canne","1 rondelle de citron jaune"],"steps":["Mettre une louche de perles dans le verre.","Remplir de glaçons.","Ajouter la passion et le thé","Mélanger vigoureusement","Décorer d'une rondelle de citron jaune."],"category":"bubble_tea"},
{"id":25,"name":"Bubble Mango Milk","ingredients":["1 louche de perles de tapioca","4cl de purée de mangue","1cl de sucre de canne","lait","chantilly","1 tranche de citron déshydraté"],"steps":["Mettre une louche de perles de tapioca dans le verre.","Ajouter le lait shaké avec la mangue et le sucre","Remplir le verre de glaçons et verser le lait à la mangue","Décorer d'un dome de chantilly","Poser le citron"],"category":"bubble_tea"},
{"id":26,"name":"Bubble Tarot Coco","ingredients":["1 louche de perles de tapioca","2 cuillère à soupe de poudre de tarot","Lait","Chantilly","4cl de coco"],"steps":["Mettre une louche de perles de tapioca dans le verre.","Ajouter le lait shaké avec la poudre et le coco","Remplir le verre de glaçons et verser le lait au tarot","Décorer d'un dome de chantilly","Saupoudrer de poudre de tarot"],"category":"bubble_tea"},
{"id":27,"name":"Ice tea passion","ingredients":["2cl de purée de passion","3cl de purée de mangue","2cl de sirop de fleur de sureau","thé glacé","1 branche de romarin","1 tranche de citron vert déshydraté"],"steps":["Mettre les purées, les sirops dans le verre.","Remplir le verre de glacons.","Verser le thé et mélanger","Décorer d'un dôme de glace pilée et d'une tranche de citron vert déshydraté et d'une branche de romarin"],"category":"the_glace"},
{"id":28,"name":"Thé glacé pêche","ingredients":["2cl de citron","2cl de sirop de peche","2cl de purée de peche","1 pincée de menthe","1 tête de menthe","1 tranche de citron vert déshydraté","Thé earl grey froid"],"steps":["Mettre les purées et les sirops dans le verre.","Remplir le verre de glacons.","Verser le thé et mélanger","Décorer d'un dôme de glace pilée et d'une tranche de citron vert et d'une tete de menthe"],"category":"the_glace"},
{"id":29,"name":"La vie en rose","ingredients":["2cl de citron","8cl de purée de fruits rouges","2cl de sirop d'orgeat","Top badoit","Espuma gingembre"],"steps":["Shaker tous les éléments ensemble sans la mousse","Remplir le verre de glacons et verser","Toper de badoit puis Mettre la mousse","Décorer de qq feuilles de romarin"],"category":"the_glace"},
{"id":30,"name":"Citronnade kalamansi","ingredients":["5cl de sirop de sucre de canne","5cl de kalamansi","Eau 20cl","45cl de glace pilée","fleur d'alysse"],"steps":["Verser le sirop de sucre et le kalamansi dans un blender","ajouter la glace pilée et l'eau","mixer et verser dans le verre doucement","completer avec un peu d'eau au centre si besoin","Décorer d'une fleur d'alysse"],"category":"the_glace"},
{"id":31,"name":"You Zou","ingredients":["3cl de sirop de sucre de canne","3cl de Yuzu","Eau","1 rondelle de citron jaune"],"steps":["Verser le sirop de sucre et le yuzu.","Remplir le verre de glaçons.","Toper à l'eau.","Décorer d'un peu de glace pilée et d'une rondelle de citron jaune."],"category":"the_glace"},
{"id":32,"name":"Kipik","ingredients":["1cl de citron","1 pincée de menthe","Ginger beer","Limonade","1 tranche de citron vert"],"steps":["Remplir le verre de glaçons.","Ajouter le citron et la menthe.","Ajouter du ginger beer jusqu'au 2/3 du verre.","Toper à la limonade.","Mélanger délicatement et décorer d'un peu de glace pilée et d'une tranche de citron vert."],"category":"the_glace"},
{"id":33,"name":"Café latte Hanoi","ingredients":["15cl de café vietnamien froid","2cl de lait concentré sucrée"],"steps":["Mettre le lait concentré sucrée dans le verre.","Remplir le verre de glace pilée.","Ajouter le café."],"category":"cafe"},
{"id":34,"name":"Matcha latte","ingredients":["2 cuillère à soupe de matcha","lait"],"steps":["Mettre le matcha dans un bol et une dose de lait","Faire chauffer le lait/matcha","Verser le lait/matcha dans le mug","Faire mousser du lait et le verser un nuage par-dessus","Saupoudrer de matcha"],"category":"cafe"},
{"id":35,"name":"Dirty Chai","ingredients":["1 cuillère doseuse de chai latte","lait","1 shot d'expresso"],"steps":["Mettre le chaï dans un bol et une dose de lait","Faire chauffer le lait/chaï","Verser le lait/chaï dans un mug","Faire mousser du lait et le verser pour faire un nuage par-dessus","verser 1 shot d'expresso","Saupoudrer de poudre chai"],"category":"cafe"},
{"id":36,"name":"Chai latte","ingredients":["1 cuillère doseuse de chai latte","lait"],"steps":["Mettre le chaï dans un bol et une dose de lait","Faire chauffer le lait/chaï","Verser le lait/chaï dans un mug","Faire mousser du lait et le verser pour faire un nuage par-dessus","Saupoudrer de poudre chai"],"category":"cafe"},
{"id":37,"name":"Le Mojito","ingredients":["4 dés de citron vert","2cl de sirop de sucre de canne","1 pincée de feuille de menthe","4cl de rhum","1 dash de Badoit","1 dash d'angostura","1 tête de menthe"],"steps":["Mettre la menthe, le citron vert et le sucre de canne dans le verre.","Piler le tout 2/3 fois pour extraire le jus et les arômes.","Remplir le verre de glace pilée.","Ajouter le rhum, le dash d'angostura et la badoit.","Mélanger pour faire remonter la menthe.","Décorer d'un dôme de glace pilée et d'une tête de menthe."],"category":"cocktail"},
{"id":38,"name":"Spritz","ingredients":["6cl d'aperol","2/3 prosecco","1/3 badoit","1 tranche d'orange"],"steps":["Remplir le verre de glaçons.","Mettre tous les ingrédients dans un verre à piscine.","Mélanger rapidement","ajouter l'orange par dessus"],"category":"cocktail"},
{"id":39,"name":"Gin tonic","ingredients":["4cl de gin","Tonic","2 tranches de Citron jaune","1cl de jus de citron"],"steps":["Mettre les glaçons Dans le verre et le citron","Verser le gin et le tonic","mélanger rapidement","Décorer d'un citron deshydraté, d'une branche de romarin","Ecraser qq baies de genievre et les poser dessus"],"category":"cocktail"},
{"id":40,"name":"Margarita","ingredients":["2cl de citron","2cl de cointreau","1cl de sucre de canne","1 pincée de sel","4cl de tequila"],"steps":["Tout mettre dans le shaker remplis de glacons","shaker énergiquement","verser dans le verre","Toper de glace pilée","Décorer d'une tranche de citron deshydraté"],"category":"cocktail"},
{"id":41,"name":"Caipirinhia","ingredients":["8 morceau de citron vert","2cl de sirop de sucre de canne","6cl de cachaca","1 tranche de citron deshydraté"],"steps":["Tout mettre dans le shaker remplis de glacons","shaker énergiquement","verser dans le verre","Toper de glace pilée","Décorer d'une tranche de citron deshydraté"],"category":"cocktail"},
{"id":42,"name":"Cam Quat (Chia)","ingredients":["130g de chia coco","40gr de mangue passion","1 tête de menthe","1 zeste de citron vert"],"steps":["Déposer le chia dans un bol","déposer 40gr par dessus de mélange passion mangue","Déposer dessus la tête de menthe","Déposer sur un bol de glacons"],"category":"dessert"},
{"id":43,"name":"Café gourmand","ingredients":["1 bol de chia + mangue passion","1 mochi coco","1 mini crème brulée","1 café","1 feuille bamboo"],"steps":["Déposer sur une planche la feuille de bamboo","Y déposer les desserts","Faire bruler la crème brulée","Poser le café","Déposer le café ou thé sur la planche"],"category":"dessert"},
{"id":44,"name":"Fortune Cookie Vanille","ingredients":["1 cookie chocolat","1 boule de glace vanille","1 cuillere à soupe de cacahuete","1 tête de menthe"],"steps":["Faite rechauffer le cookie 30sec au micro onde","Ajouter les cacahuetes puis la glace","Poser une tête de menthe"],"category":"dessert"},
{"id":45,"name":"Fortune Cookie Coco","ingredients":["1 cookie chocolat","1 boule de glace coco","1 cuillère à soupe de coco rapée","1 tête de menthe"],"steps":["Faite rechauffer le cookie 30sec au micro onde","Ajouter la coco et la glace","Décorer d'une tête de menthe"],"category":"dessert"},
{"id":46,"name":"Gato So Cola","ingredients":["1 moêlleux chocolat","1 boule de glace vanille rase","1 plaque choco"],"steps":["Faite rechauffer le moelleux 30sec au micro onde","Ajouter la boule de glace rase par dessus","Ajouter la plaque"],"category":"dessert"},
{"id":47,"name":"Crème brulée sésame","ingredients":["1 crème brulée","10gr de sucre fin","1 ptt cuillère à glace de glace coco"],"steps":["Saupoudrer de sucre fin sur toute la surface","Retourner la crème en tapant pour enlever l'excédent","Caraméliser au chalumeau","Ajouter la boule de glace"],"category":"dessert"}
];
const CAT_EMOJI = {
cocktail: '🍸',
force: '❄️',
smoothie: '🥤',
bubble_tea: '🧋',
the_glace: '🍵',
cafe: '☕',
dessert: '🍮',
autre: '🍽️'
};
const CAT_LABEL = {
cocktail: 'Cocktail',
force: 'Force',
smoothie: 'Smoothie',
bubble_tea: 'Bubble Tea',
the_glace: 'Thé glacé',
cafe: 'Café',
dessert: 'Dessert',
autre: 'Autre'
};
const CAT_COLOR = {
cocktail: 'var(--violet)',
force: 'var(--teal)',
smoothie: 'var(--green)',
bubble_tea: 'var(--rose)',
the_glace: 'var(--blue)',
cafe: 'var(--amber)',
dessert: 'var(--gold)'
};
const CAT_BG = {
cocktail: 'rgba(168,85,247,0.08)',
force: 'rgba(0,210,200,0.08)',
smoothie: 'rgba(16,185,129,0.08)',
bubble_tea: 'rgba(255,107,157,0.08)',
the_glace: 'rgba(59,130,246,0.08)',
cafe: 'rgba(255,159,67,0.08)',
dessert: 'rgba(245,200,66,0.08)'
};
// ══════════════════════════════════════════
// ANIMATION DES PARTICULES
// ══════════════════════════════════════════
function spawnParticles() {
const container = document.getElementById('particles');
const colors = ['#f5c842', '#ff9f43', '#ff6b9d', '#00d2c8', '#a855f7', '#3b82f6'];
for (let i = 0; i < 20; i++) {
const particle = document.createElement('div');
particle.className = 'particle';
const size = Math.random() * 4 + 2;
particle.style.cssText = `
width: ${size}px;
height: ${size}px;
left: ${Math.random() * 100}%;
background: ${colors[Math.floor(Math.random() * colors.length)]};
animation-duration: ${Math.random() * 15 + 10}s;
animation-delay: -${Math.random() * 15}s;
`;
container.appendChild(particle);
}
}
// ══════════════════════════════════════════
// AUTHENTIFICATION FIREBASE
// ══════════════════════════════════════════
window._showApp = function(user) {
const loginScreen = document.getElementById('loginScreen');
loginScreen.classList.add('hiding');
setTimeout(() => {
loginScreen.style.display = 'none';
const appEl = document.getElementById('app');
appEl.style.display = 'block';
requestAnimationFrame(() => appEl.classList.add('visible'));
// Affichage des informations utilisateur
const email = user.email || '';
const name = email.split('@')[0];
const displayName = name.charAt(0).toUpperCase() + name.slice(1);
document.getElementById('userName').textContent = displayName;
document.getElementById('userAvatar').textContent = displayName.charAt(0).toUpperCase();
document.getElementById('dashName').textContent = displayName;
initApp();
}, 800);
};
window._showLogin = function() {
const loginScreen = document.getElementById('loginScreen');
document.getElementById('app').style.display = 'none';
document.getElementById('app').classList.remove('visible');
loginScreen.style.display = 'flex';
loginScreen.classList.remove('hiding');
loginScreen.style.opacity = '0';
document.getElementById('loginUser').value = '';
document.getElementById('loginPass').value = '';
requestAnimationFrame(() => {
loginScreen.style.transition = 'opacity 0.5s';
loginScreen.style.opacity = '1';
});
};
async function tryLogin() {
const email = document.getElementById('loginUser').value.trim();
const password = document.getElementById('loginPass').value;
const errorEl = document.getElementById('loginError');
const btn = document.getElementById('loginBtn');
const btnText = document.getElementById('loginBtnText');
const btnSpinner = document.getElementById('loginBtnSpinner');
if (!email || !password) {
errorEl.textContent = '❌ Veuillez remplir tous les champs';
errorEl.style.display = 'block';
return;
}
btn.disabled = true;
btnText.style.display = 'none';
btnSpinner.style.display = 'inline';
errorEl.style.display = 'none';
try {
if (!window._fbSignIn) {
throw new Error('Firebase non initialisé — rechargez la page');
}
await window._fbSignIn(email, password);
} catch (error) {
btn.disabled = false;
btnText.style.display = 'inline';
btnSpinner.style.display = 'none';
const errorMessages = {
'auth/user-not-found': '❌ Aucun compte trouvé avec cet email',
'auth/wrong-password': '❌ Mot de passe incorrect',
'auth/invalid-email': '❌ Adresse email invalide',
'auth/too-many-requests': '⚠️ Trop de tentatives, réessayez plus tard',
'auth/invalid-credential': '❌ Email ou mot de passe incorrect',
};
errorEl.textContent = errorMessages[error.code] || '❌ Erreur : ' + (error.message || 'inconnue');
errorEl.style.display = 'block';
const box = document.querySelector('.login-box');
box.style.animation = 'shake 0.4s ease';
setTimeout(() => box.style.animation = '', 400);
}
}
async function doLogout() {
showToast('Au revoir ! 👋', 'info');
const overlay = document.getElementById('logoutOverlay');
overlay.classList.add('visible');
setTimeout(async () => {
try {
if (window._fbSignOut) await window._fbSignOut();
} catch (e) {
console.error(e);
}
overlay.classList.remove('visible');
}, 1500);
}
// ══════════════════════════════════════════
// INITIALISATION
// ══════════════════════════════════════════
function initApp() {
document.querySelectorAll('.nav-link').forEach(link => {
link.addEventListener('click', e => {
e.preventDefault();
navigateTo(link.dataset.page);
});
});
loadDashboard();
loadVentes();
loadStock();
loadEquipe();
renderRecipes();
}
function navigateTo(page) {
document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
document.getElementById(page).classList.add('active');
const link = document.querySelector(`[data-page="${page}"]`);
if (link) link.classList.add('active');
if (page === 'dashboard') loadDashboard();
}
// ══════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════
function loadDashboard() {
const total = appData.ventes.reduce((sum, v) => sum + v.quantite * v.prix, 0);
document.getElementById('totalVentes').textContent = formatMoney(total);
document.getElementById('nbVentes').textContent = appData.ventes.length;
const actifs = appData.equipe.filter(e => e.actif).length;
document.getElementById('equipePresente').textContent = `${actifs}/${appData.equipe.length}`;
const faible = appData.stock.filter(s => s.quantite <= s.quantiteMin).length;
document.getElementById('stockFaible').textContent = faible;
// Top produits
const produitsVendus = {};
appData.ventes.forEach(v => {
produitsVendus[v.produit] = (produitsVendus[v.produit] || 0) + v.quantite;
});
const topProduits = Object.entries(produitsVendus)
.sort((a, b) => b[1] - a[1])
.slice(0, 5);
document.getElementById('topProduits').innerHTML = `
<div class="top-list">
${topProduits.map(([name, qty], i) => `
<div class="top-rank">${i + 1}</div>
<div class="top-name">${name}</div>
<div class="top-qty">${qty} vendus</div>
`).join('')}
</div>
`;
// Badges de catégories
const categories = [...new Set(RECIPES.map(r => r.category))];
document.getElementById('catBadges').innerHTML = categories.map(cat => `
<span class="badge" style="background:${CAT_BG[cat]};color:${CAT_COLOR[cat]}">
${CAT_EMOJI[cat]} ${CAT_LABEL[cat]}
`).join('');
// Alertes stock
const alertesStock = appData.stock.filter(s => s.quantite <= s.quantiteMin);
document.getElementById('stockAlerts').innerHTML = alertesStock.length ?
alertesStock.map(s => `
<span style="font-weight:500">${s.produit}</span>
<span class="badge badge-red">⚠️ ${s.quantite} restants</span>
`).join('') :
'<p style="color:var(--green)">✅ Tous les stocks sont OK</p>';
// Résumé équipe
document.getElementById('equipeResume').innerHTML = appData.equipe.map(e => `
<span>${e.avatar} <strong>${e.nom}</strong> — ${e.poste}</span>
<span class="badge ${e.actif ? 'badge-green' : 'badge-red'}">
${e.actif ? '✅ Présent' : '❌ Absent'}
`).join('');
}
// ══════════════════════════════════════════
// VENTES
// ══════════════════════════════════════════
function loadVentes() {
const tbody = document.getElementById('ventesBody');
if (!appData.ventes.length) {
tbody.innerHTML = `
<tr>
<td colspan="6">
<div class="empty-state">
<div class="empty-icon">💰</div>
<div class="empty-text">Aucune vente enregistrée</div>
</div>
</td>
</tr>
`;
return;
}
tbody.innerHTML = appData.ventes.map(v => `
<td style="color:var(--muted)">${formatDate(v.date)}</td>
<td><strong>${v.produit}</strong></td>
<td>${v.quantite}</td>
<td>${formatMoney(v.prix)}</td>
<td><strong style="color:var(--gold)">${formatMoney(v.quantite * v.prix)}</strong></td>
<button class="btn btn-red btn-sm" onclick="deleteVente(${v.id})">
`).join('');
}
function deleteVente(id) {
if (!confirm('Supprimer cette vente ?')) return;
appData.ventes = appData.ventes.filter(v => v.id !== id);
loadVentes();
loadDashboard();
showToast('Vente supprimée', 'error');
}
function openAddVente() {
const options = appData.stock.map(s =>
`<option value="${s.produit}" data-prix="${s.prix}">${s.produit} (${formatMoney(s.prix)})</option>`
).join('');
openModal('💰', 'Nouvelle Vente', `
<select class="form-ctrl" id="v_produit">${options}</select>
`);
}
function saveVente() {
const produit = document.getElementById('v_produit').value;
const qty = parseInt(document.getElementById('v_qty').value);
if (!qty || qty < 1) {
showToast('Quantité invalide', 'error');
return;
}
const stock = appData.stock.find(s => s.produit === produit);
appData.ventes.push({
id: Date.now(),
produit,
quantite: qty,
prix: stock.prix,
date: new Date()
});
stock.quantite = Math.max(0, stock.quantite - qty);
closeModal();
loadVentes();
loadStock();
loadDashboard();
showToast(`Vente enregistrée : ${qty}x ${produit}`, 'success');
}
// ══════════════════════════════════════════
// STOCK
// ══════════════════════════════════════════
function loadStock() {
const tbody = document.getElementById('stockBody');
tbody.innerHTML = appData.stock.map(s => {
const pct = Math.min(100, Math.round(s.quantite / Math.max(s.quantiteMin * 2, 1) * 100));
const color = s.quantite <= s.quantiteMin ? 'var(--red)' : pct < 70 ? 'var(--amber)' : 'var(--green)';
return `
<td><strong>${s.produit}</strong></td>
<span style="min-width:30px">${s.quantite}</span>
<div class="stock-bar-fill" style="width:${pct}%;background:${color}"></div>
<td style="color:var(--muted)">${s.quantiteMin}</td>
<td>${formatMoney(s.prix)}</td>
<span class="badge ${s.quantite <= s.quantiteMin ? 'badge-red' : 'badge-green'}">
${s.quantite <= s.quantiteMin ? '⚠️ Faible' : '✅ OK'}
<button class="btn btn-green btn-sm" onclick="addStock(${s.id})">+10</button>
<button class="btn btn-red btn-sm" onclick="delStock(${s.id})">🗑</button>
`;
}).join('');
}
function addStock(id) {
const stock = appData.stock.find(s => s.id === id);
if (stock) {
stock.quantite += 10;
loadStock();
loadDashboard();
showToast(`+10 ${stock.produit} ajoutés`, 'success');
}
}
function delStock(id) {
if (!confirm('Supprimer ce produit ?')) return;
appData.stock = appData.stock.filter(s => s.id !== id);
loadStock();
loadDashboard();
showToast('Produit supprimé', 'error');
}
function openAddProduit() {
openModal('📦', 'Nouveau Produit', `
`);
}
function saveProduit() {
const nom = document.getElementById('p_nom').value.trim();
const qty = parseInt(document.getElementById('p_qty').value);
const min = parseInt(document.getElementById('p_min').value);
const prix = parseFloat(document.getElementById('p_prix').value);
if (!nom) {
showToast('Nom requis', 'error');
return;
}
appData.stock.push({
id: Date.now(),
produit: nom,
quantite: qty,
quantiteMin: min,
});
closeModal();
loadStock();
loadDashboard();
showToast(`${nom} ajouté au stock`, 'success');
}
// ══════════════════════════════════════════
// ÉQUIPE
// ══════════════════════════════════════════
function loadEquipe() {
const grid = document.getElementById('equipeGrid');
grid.innerHTML = appData.equipe.map(e => `
<div class="member-card" style="border-color:${e.actif ? 'rgba(16,185,129,0.2)' : 'var(--border)'}">
<div class="member-avatar" style="background:${e.actif ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}">
${e.avatar}
<div class="member-name">${e.nom}</div>
<div class="member-role">${e.poste}</div>
<div class="member-hours">🕐 ${e.horaire}</div>
<span class="badge ${e.actif ? 'badge-green' : 'badge-red'}" style="margin-bottom:1rem">
${e.actif ? '✅ Présent' : '❌ Absent'}
<button class="btn btn-ghost btn-sm" onclick="togglePresence(${e.id})">
${e.actif ? 'Marquer absent' : 'Marquer présent'}
<button class="btn btn-red btn-sm" onclick="delMembre(${e.id})">🗑</button>
`).join('');
}
function togglePresence(id) {
const membre = appData.equipe.find(e => e.id === id);
if (membre) {
membre.actif = !membre.actif;
loadEquipe();
loadDashboard();
showToast(`${membre.nom} : ${membre.actif ? 'présent ✅' : 'absent ❌'}`, 'info');
}
}
function delMembre(id) {
if (!confirm('Supprimer ce membre ?')) return;
appData.equipe = appData.equipe.filter(e => e.id !== id);
loadEquipe();
loadDashboard();
showToast('Membre supprimé', 'error');
}
function openAddMembre() {
openModal('👥', 'Nouveau Membre', `
`);
}
function saveMembre() {
const nom = document.getElementById('m_nom').value.trim();
const poste = document.getElementById('m_poste').value;
const horaire = document.getElementById('m_horaire').value.trim() || 'À définir';
if (!nom) {
showToast('Nom requis', 'error');
return;
}
const avatars = ['👨‍🍳', '👩‍🍳', '👨‍💼', '👩‍💼', '🧑‍🍳', '🧑‍💼'];
appData.equipe.push({
id: Date.now(),
nom,
poste,
actif: true,
horaire,
avatar: avatars[Math.floor(Math.random() * avatars.length)]
});
closeModal();
loadEquipe();
loadDashboard();
showToast(`${nom} ajouté à l'équipe`, 'success');
}
// ══════════════════════════════════════════
// RECETTES
// ══════════════════════════════════════════
function renderRecipes() {
const searchQuery = (document.getElementById('recetteSearch')?.value || '').toLowerCase().trim();
const filteredList = RECIPES.filter(recipe => {
const matchCategory = activeCat === 'all' || recipe.category === activeCat;
const matchSearch = !searchQuery ||
recipe.name.toLowerCase().includes(searchQuery) ||
recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery));
return matchCategory && matchSearch;
});
const grid = document.getElementById('recipesGrid');
if (!filteredList.length) {
grid.innerHTML = `
<div class="empty-state" style="grid-column:1/-1">
<div class="empty-icon">🔍</div>
<div class="empty-text">Aucune recette trouvée</div>
</div>
`;
return;
}
grid.innerHTML = filteredList.map((recipe, index) => `
<div class="recipe-card" onclick="openRecipe(${recipe.id})" style="animation-delay:${index * 0.03}s">
<div class="recipe-thumb" style="background:${CAT_BG[recipe.category] || 'rgba(255,255,255,0.04)'}">
<span>${CAT_EMOJI[recipe.category] || '🍽️'}</span>
<div class="recipe-name">${recipe.name}</div>
<span class="badge" style="background:${CAT_BG[recipe.category]};color:${CAT_COLOR[recipe.category]}">
${CAT_LABEL[recipe.category] || recipe.category}
<span class="recipe-count">${recipe.ingredients.length} ingrédients</span>
`).join('');
}
function setCat(btn, cat) {
document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
btn.classList.add('active');
activeCat = cat;
renderRecipes();
}
function filterRecettes() {
renderRecipes();
}
function openRecipe(id) {
const recipe = RECIPES.find(r => r.id === id);
if (!recipe) return;
openModal(CAT_EMOJI[recipe.category] || '🍽️', recipe.name, `
<p class="section-title">Ingrédients (${recipe.ingredients.length})</p>
${recipe.ingredients.map(ing => `
<div class="ing-dot"></div>${ing}
`).join('')}
<p class="section-title">Préparation (${recipe.steps.length} étapes)</p>
${recipe.steps.map((step, i) => `
<div class="step-num">${i + 1}</div>
<div>${step}</div>
`).join('')}
<span class="badge" style="margin-top:0.4rem;background:${CAT_BG[recipe.category]};color:${CAT_COLOR[recipe.category]}">
${CAT_EMOJI[recipe.category]} ${CAT_LABEL[recipe.category]}
`);
}
// ══════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════
function openModal(emoji, title, body) {
document.getElementById('modalEmoji').textContent = emoji;
document.getElementById('modalTitle').textContent = title;
document.getElementById('modalBody').innerHTML = body;
document.getElementById('modal').classList.add('active');
}
function closeModal() {
document.getElementById('modal').classList.remove('active');
}
// ══════════════════════════════════════════
// NOTIFICATIONS TOAST
// ══════════════════════════════════════════
function showToast(message, type = 'success') {
const icons = {
success: '✅',
error: '❌',
info: 'ℹ️'
};
const toast = document.createElement('div');
toast.className = `toast toast-${type}`;
toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span>`;
document.getElementById('toastContainer').appendChild(toast);
setTimeout(() => {
toast.classList.add('leaving');
setTimeout(() => toast.remove(), 300);
}, 3000);
}
// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════
function formatMoney(value) {
return new Intl.NumberFormat('fr-FR', {
style: 'currency',
currency: 'EUR'
}).format(value);
}
function formatDate(date) {
return new Date(date).toLocaleDateString('fr-FR');
}
// ══════════════════════════════════════════
// ÉVÉNEMENTS
// ══════════════════════════════════════════
document.addEventListener('keydown', (e) => {
if (e.key === 'Enter') {
const loginScreen = document.getElementById('loginScreen');
if (loginScreen.style.display !== 'none' && !loginScreen.classList.contains('hiding')) {
tryLogin();
}
}
});
// Animation shake pour le formulaire de connexion
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
`;
document.head.appendChild(shakeStyle);
// Initialisation des particules au chargement
spawnParticles();