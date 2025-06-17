const Group = require('../models/Group');

function getRessource(ressources, type) {
    return ressources.find(r => r.type === type);
}

async function updateGroupResources(groupId) {
    const group = await Group.findById(groupId);
    if (!group) return;

    const memberCount = group.membres.length || 0;
    const npcCount = group.pnjs.length || 0;
    const totalCount = memberCount + npcCount;

    // Consommation
    const food = getRessource(group.ressources, 'food');
    const water = getRessource(group.ressources, 'water');
    const fuel = getRessource(group.ressources, 'fuel');
    const materials = getRessource(group.ressources, 'materials');

    if (food) food.quantite = Math.max(0, food.quantite - 5 * totalCount);
    if (water) water.quantite = Math.max(0, water.quantite - 3 * totalCount);
    if (fuel) fuel.quantite = Math.max(0, fuel.quantite - 1 * totalCount);
    if (materials) materials.quantite = Math.max(0, materials.quantite - 1 * totalCount);

    // Moral
    if (food && food.quantite === 0 || water && water.quantite === 0) {
        group.moral = (group.moral || 100) - 15;
    } else if (
        (food && food.quantite < 20) ||
        (water && water.quantite < 20) ||
        (fuel && fuel.quantite < 10) ||
        (materials && materials.quantite < 10)
    ) {
        group.moral = (group.moral || 100) - 5;
    }
    group.moral = Math.max(0, Math.min(100, group.moral || 100));

    group.lastUpdate = Date.now();
    await group.save();
}

module.exports = { updateGroupResources };

