(self.webpackChunkroguelikedev_2021=self.webpackChunkroguelikedev_2021||[]).push([[164],{9947:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_actor","type":"actor","components":{"characterobject":{"scale":0.1,"fontName":"helvetiker","xRot":0.5,"yRot":0.25,"zOffset":0.5},"blocksMovement":true,"fighter":{}}},{"id":"base_mplus_actor","extends":"base_actor","components":{"characterobject":{"fontName":"mplus","zOffset":0.1}}}]')},6355:e=>{"use strict";e.exports=JSON.parse('[{"id":"orc","extends":"base_actor","name":"Orc","components":{"characterobject":{"letter":"o","color":"#3f7f3f"},"faction":{"factions":"monsters","enemies":"player"},"aiMeleeChase":{},"fighter":{"baseHp":10,"baseDefense":1,"baseDamage":4},"level":{"xpGiven":35},"inventory":{"gold":"1,10"}}},{"id":"giant_rat","extends":"base_actor","name":"Giant Rat","components":{"characterobject":{"letter":"r","color":"#222222"},"faction":{"factions":"monsters","enemies":"player"},"aiMeleeChase":{"radius":3,"movementActions":2},"fighter":{"baseHp":10,"baseDamage":2},"level":{"xpGiven":10}}},{"id":"skeleton","extends":"base_actor","name":"Skeleton","components":{"characterobject":{"letter":"s","color":"#cccccc"},"faction":{"factions":"monsters","enemies":"player"},"aiMeleeChase":{"movementActions":0.8},"fighter":{"baseHp":20,"baseDefense":1,"baseDamage":5},"level":{"xpGiven":45}}},{"id":"troll","extends":"base_actor","name":"Troll","components":{"characterobject":{"letter":"T","color":"#007f00"},"faction":{"factions":"monsters","enemies":"player"},"aiMeleeChase":{"movementActions":0.75},"fighter":{"baseHp":50,"baseDefense":3,"baseDamage":6},"level":{"xpGiven":100},"inventory":{"gold":"15,75"}}},{"id":"giant","extends":"base_actor","name":"Giant","components":{"characterobject":{"letter":"G","color":"#cc0000"},"faction":{"factions":"monsters","enemies":"player"},"aiMeleeChase":{"movementActions":0.6},"fighter":{"baseHp":75,"baseDefense":4,"baseDamage":8},"level":{"xpGiven":500},"inventory":{"gold":"35,200"}}},{"id":"snake","extends":"base_mplus_actor","name":"Snake","components":{"characterobject":{"letter":"〰","color":"#ff0000"},"faction":{"factions":"monsters","enemies":"player"},"fighter":{"baseHp":6,"baseDamage":6},"level":{"xpGiven":25},"aiMeleeChase":{}}},{"id":"gelatinous_cube","extends":"base_mplus_actor","name":"Gelatinous Cube","components":{"characterobject":{"letter":"■","color":"#90EE90","scale":0.9,"xRot":0,"yRot":0,"zRot":0,"opacity":0.65},"faction":{"factions":"monsters","enemies":"player"},"fighter":{"baseHp":40,"baseDefense":2,"baseDamage":3},"level":{"xpGiven":175},"aiGelatinousCube":{},"explodeOnDeath":{},"attachedItems":{}}},{"id":"exploding_sheep","extends":"base_actor","name":"Exploding Sheep","components":{"characterobject":{"letter":"s","color":"#ffa500"},"faction":{"factions":"monsters","enemies":"player"},"fighter":{"baseHp":30,"baseDamage":4},"level":{"xpGiven":15},"aiMeleeChase":{},"explodeOnDeath":{"damage":15,"radius":1}}}]')},2669:e=>{"use strict";e.exports=JSON.parse('[{"id":"shop_owner","extends":"base_actor","name":"Shop Owner","components":{"characterobject":{"letter":"$","color":"#ffff00"},"faction":{"factions":"npc"},"aiMeleeChase":{}}}]')},3751:e=>{"use strict";e.exports=JSON.parse('[{"id":"ant","extends":"base_actor","name":"Ant","components":{"characterobject":{"letter":"a","color":"#000000"},"faction":{"factions":"monsters","enemies":"player"},"aiMeleeChase":{}}},{"id":"dragon_red","extends":"base_actor","name":"Red Dragon","components":{"characterobject":{"letter":"D","color":"#ff0000"},"faction":{"factions":"monsters","enemies":"player"},"aiMeleeChase":{}}},{"id":"goblin","extends":"base_actor","name":"Goblin","components":{"characterobject":{"letter":"g","color":"#3f7f3f"},"faction":{"factions":"monsters","enemies":"player"},"aiMeleeChase":{}}}]')},9781:e=>{"use strict";e.exports=JSON.parse('[{"id":"player","extends":"base_actor","name":"Player","components":{"characterobject":{"letter":"@","color":"#ffffff"},"faction":{"factions":"player","enemies":"monsters"},"fighter":{"strength":5,"agility":2,"constitution":2,"wisdom":2},"inventory":{},"equipment":{"items":[null,null,null,null,null,null,null,{"load":"belt_2slot","components":{"equippable":{"defense":0,"maxStorage":2,"storage":[{"load":"potion_health","amount":2}]}}},null,{"load":"pouch_small"},null,null]},"level":{"level":1},"aiPlayer":{}}}]')},7471:e=>{"use strict";e.exports=[]},3562:e=>{"use strict";e.exports=JSON.parse('[{"id":"scroll","items":[{"id":"scroll_lightning","weight":20},{"id":"scroll_confusion","weight":5},{"id":"scroll_fireball","weight":10},{"id":"scroll_town_portal","weight":20}]},{"id":"potion","items":[{"id":"potion_health","weight":30},{"id":"potion_mana","weight":10}]},{"id":"weapon_tier1","items":[{"id":"dagger","weight":30},{"id":"short_sword","weight":10}]},{"id":"weapon_tier2","items":[{"id":"short_sword","weight":30},{"id":"staff","weight":10},{"group":"weapon_tier1","weight":40}]},{"id":"weapon_tier3","items":[{"id":"staff","weight":30},{"id":"flail","weight":10},{"group":"weapon_tier2","weight":40}]},{"id":"weapon_tier4","items":[{"id":"flail","weight":30},{"id":"long_sword","weight":10},{"group":"weapon_tier3","weight":40}]},{"id":"armor_tier1","items":[{"id":"leather_armor","weight":100},{"id":"belt_2slot","weight":20},{"id":"belt_3slot","weight":10},{"id":"leather_boots","weight":40},{"id":"leather_gloves","weight":40},{"id":"leather_cap","weight":40},{"id":"round_shield","weight":50},{"id":"cape","weight":30},{"id":"pouch_small","weight":30},{"id":"amulet_of_power_weak","weight":5},{"id":"ring_of_health_weak","weight":10},{"id":"ring_of_mana_weak","weight":10}]},{"id":"armor_tier2","items":[{"id":"chainmail","weight":80},{"id":"belt_3slot","weight":20},{"id":"belt_4slot","weight":10},{"id":"chain_boots","weight":40},{"id":"chain_gloves","weight":40},{"id":"chainmail_hood","weight":40},{"id":"kite_shield","weight":10},{"id":"round_shield","weight":5},{"id":"shoulder_pads","weight":30},{"id":"pouch_large","weight":30},{"group":"armor_tier1","weight":150}]},{"id":"armor_tier3","items":[{"id":"scalemail","weight":70},{"id":"belt_4slot","weight":20},{"id":"belt_5slot","weight":10},{"id":"scale_boots","weight":40},{"id":"scale_gloves","weight":40},{"id":"scale_helm","weight":40},{"id":"kite_shield","weight":30},{"id":"spaulders","weight":30},{"id":"pouch_large","weight":30},{"id":"amulet_of_power","weight":10},{"id":"ring_of_health","weight":20},{"id":"ring_of_mana","weight":20},{"group":"armor_tier2","weight":150}]},{"id":"armor_tier4","items":[{"id":"platemail","weight":60},{"id":"belt_5slot","weight":20},{"id":"belt_6slot","weight":10},{"id":"plate_greaves","weight":40},{"id":"plate_gauntlets","weight":40},{"id":"full_helm","weight":40},{"id":"tower_shield","weight":30},{"id":"round_shield","weight":10},{"id":"pauldrons","weight":30},{"id":"pouch_large","weight":30},{"group":"armor_tier3","weight":150}]}]')},9135:e=>{"use strict";e.exports=JSON.parse('[{"level":1,"actors":[{"id":"orc","weight":35},{"id":"giant_rat","weight":50},{"id":"skeleton","weight":20},{"id":"snake","weight":10}],"items":[{"group":"potion","weight":50},{"group":"scroll","weight":50},{"group":"weapon_tier1","weight":25},{"group":"armor_tier1","weight":50}]},{"level":2,"actors":[{"id":"orc","weight":50},{"id":"giant_rat","weight":25},{"id":"skeleton","weight":30},{"id":"snake","weight":15}],"items":[{"group":"potion","weight":50},{"group":"scroll","weight":50},{"group":"weapon_tier1","weight":25},{"group":"armor_tier1","weight":50}]},{"level":3,"actors":[{"id":"orc","weight":50},{"id":"giant_rat","weight":10},{"id":"skeleton","weight":40},{"id":"snake","weight":20},{"id":"exploding_sheep","weight":20},{"id":"troll","weight":20}],"items":[{"group":"potion","weight":50},{"group":"scroll","weight":50},{"group":"weapon_tier2","weight":25},{"group":"armor_tier2","weight":50}]},{"level":4,"actors":[{"id":"orc","weight":25},{"id":"giant_rat","weight":5},{"id":"skeleton","weight":40},{"id":"snake","weight":30},{"id":"exploding_sheep","weight":30},{"id":"troll","weight":50},{"id":"gelatinous_cube","weight":5}],"items":[{"group":"potion","weight":50},{"group":"scroll","weight":50},{"group":"weapon_tier2","weight":25},{"group":"armor_tier2","weight":50}]},{"level":5,"actors":[{"id":"orc","weight":10},{"id":"skeleton","weight":20},{"id":"snake","weight":30},{"id":"exploding_sheep","weight":30},{"id":"troll","weight":80},{"id":"gelatinous_cube","weight":10},{"id":"giant","weight":5}],"items":[{"group":"potion","weight":50},{"group":"scroll","weight":50},{"group":"weapon_tier3","weight":25},{"group":"armor_tier3","weight":50}]},{"level":6,"actors":[{"id":"orc","weight":10},{"id":"skeleton","weight":20},{"id":"snake","weight":30},{"id":"exploding_sheep","weight":30},{"id":"troll","weight":60},{"id":"gelatinous_cube","weight":15},{"id":"giant","weight":10}],"items":[{"group":"potion","weight":50},{"group":"scroll","weight":50},{"group":"weapon_tier3","weight":25},{"group":"armor_tier3","weight":50}]},{"level":7,"actors":[{"id":"orc","weight":10},{"id":"skeleton","weight":20},{"id":"snake","weight":30},{"id":"exploding_sheep","weight":30},{"id":"troll","weight":60},{"id":"gelatinous_cube","weight":30},{"id":"giant","weight":20}],"items":[{"group":"potion","weight":50},{"group":"scroll","weight":50},{"group":"weapon_tier4","weight":25},{"group":"armor_tier4","weight":50}]}]')},515:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_item","type":"item","components":{"characterobject":{"scale":0.1,"font":"helvetiker"}}},{"id":"base_item_mplus","extends":"base_item","components":{"characterobject":{"fontName":"mplus"}}}]')},9955:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_amulet","extends":"base_item_mplus","components":{"characterobject":{"letter":"ᴕ"},"equippable":{"slot":"amulet"}}},{"id":"amulet_of_power_weak","extends":"base_amulet","name":"Weak Amulet of Power","description":"Weak Amulet of Power","components":{"characterobject":{"color":"#990f02"},"equippable":{"strength":"0-1","agility":"0-1","constitution":"0-1","wisdom":"0-1"}}},{"id":"amulet_of_power","extends":"base_amulet","name":"Amulet of Power","description":"Amulet of Power","components":{"characterobject":{"color":"#990f02"},"equippable":{"strength":"0-3","agility":"0-3","constitution":"0-3","wisdom":"0-3"}}}]')},5448:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_armor","extends":"base_item_mplus","components":{"characterobject":{"letter":"☗"},"equippable":{"slot":"body"}}},{"id":"leather_armor","extends":"base_armor","name":"Leather Armor","description":"Leather Armor","components":{"characterobject":{"color":"#4f361b","size":0.6},"equippable":{"defense":"10-25"}}},{"id":"chainmail","extends":"base_armor","name":"Chainmail","description":"Chainmail","components":{"characterobject":{"color":"#bab3af","size":0.6},"equippable":{"defense":"25-50"}}},{"id":"scalemail","extends":"base_armor","name":"Scale Mail","description":"Scale Mail","components":{"characterobject":{"color":"#ddded8","size":0.6},"equippable":{"defense":"50-90"}}},{"id":"platemail","extends":"base_armor","name":"Plate Mail","description":"Plate Mail","components":{"characterobject":{"color":"#dce5e7","size":0.6},"equippable":{"defense":"90-160"}}}]')},6811:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_belt","extends":"base_item","components":{"characterobject":{"letter":"-","color":"#4f361b"},"equippable":{"slot":"belt"}}},{"id":"belt_2slot","extends":"base_belt","name":"2-Slot Belt","description":"2-Slot Belt","components":{"equippable":{"defense":"1-5","maxStorage":2}}},{"id":"belt_3slot","extends":"base_belt","name":"3-Slot Belt","description":"3-Slot Belt","components":{"equippable":{"defense":"3-10","maxStorage":3}}},{"id":"belt_4slot","extends":"base_belt","name":"4-Slot Belt","description":"4-Slot Belt","components":{"equippable":{"defense":"7-15","maxStorage":4}}},{"id":"belt_5slot","extends":"base_belt","name":"5-Slot Belt","description":"5-Slot Belt","components":{"characterobject":{"letter":"="},"equippable":{"defense":"12-20","maxStorage":5}}},{"id":"belt_6slot","extends":"base_belt","name":"6-Slot Belt","description":"6-Slot Belt","components":{"characterobject":{"letter":"="},"equippable":{"defense":"16-25","maxStorage":6}}}]')},7777:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_boots","extends":"base_item","components":{"characterobject":{"fontName":"jetbrains","letter":"◫"},"equippable":{"slot":"boots"}}},{"id":"leather_boots","extends":"base_boots","name":"Leather Boots","description":"Leather Boots","components":{"characterobject":{"color":"#4f361b"},"equippable":{"defense":"1-12"}}},{"id":"chain_boots","extends":"base_boots","name":"Chain Boots","description":"Chain Boots","components":{"characterobject":{"color":"#bab3af"},"equippable":{"defense":"8-24"}}},{"id":"scale_boots","extends":"base_boots","name":"Scale Boots","description":"Scale Boots","components":{"characterobject":{"color":"#ddded8"},"equippable":{"defense":"22-48"}}},{"id":"plate_greaves","extends":"base_boots","name":"Plate Greaves","description":"Plate Greaves","components":{"characterobject":{"color":"#dce5e7"},"equippable":{"defense":"45-90"}}}]')},2373:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_gloves","extends":"base_item","components":{"characterobject":{"fontName":"jetbrains","letter":"″"},"equippable":{"slot":"gloves"}}},{"id":"leather_gloves","extends":"base_gloves","name":"Leather Gloves","description":"Leather Gloves","components":{"characterobject":{"color":"#4f361b"},"equippable":{"defense":"1-10"}}},{"id":"chain_gloves","extends":"base_gloves","name":"Chain Gloves","description":"Chain Gloves","components":{"characterobject":{"color":"#bab3af"},"equippable":{"defense":"6-22"}}},{"id":"scale_gloves","extends":"base_gloves","name":"Scale Gloves","description":"Scale Gloves","components":{"characterobject":{"color":"#ddded8"},"equippable":{"defense":"18-40"}}},{"id":"plate_gauntlets","extends":"base_gloves","name":"Plate Gauntlets","description":"Plate Gauntlets","components":{"characterobject":{"color":"#dce5e7"},"equippable":{"defense":"35-75"}}}]')},8456:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_helmet","extends":"base_item_mplus","components":{"characterobject":{"letter":"∩"},"equippable":{"slot":"helmet"}}},{"id":"leather_cap","extends":"base_helmet","name":"Leather Cap","description":"Leather Cap","components":{"characterobject":{"color":"#4f361b"},"equippable":{"defense":"1-20"}}},{"id":"chainmail_hood","extends":"base_helmet","name":"Chainmail Hood","description":"Chainmail Hood","components":{"characterobject":{"color":"#bab3af"},"equippable":{"defense":"15-35"}}},{"id":"scale_helm","extends":"base_helmet","name":"Scale Helm","description":"Scale Helm","components":{"characterobject":{"color":"#ddded8"},"equippable":{"defense":"30-65"}}},{"id":"full_helm","extends":"base_helmet","name":"Full Helm","description":"Full Helm","components":{"characterobject":{"color":"#dce5e7"},"equippable":{"defense":"50-100"}}}]')},9747:e=>{"use strict";e.exports=JSON.parse('[{"id":"gold","extends":"base_item","name":"Gold","description":"Helps to fund your adventures","maxStackSize":-1,"components":{"characterobject":{"letter":"•","color":"#f5b82c","scale":0.05,"size":0.5}}},{"id":"^","extends":"base_item","name":"^","components":{"characterobject":{"letter":"^","color":"#ffffff"}}}]')},1271:e=>{"use strict";e.exports=JSON.parse('[{"id":"potion","extends":"base_item","maxStackSize":20,"components":{"characterobject":{"letter":"!"}}},{"id":"potion_health","extends":"potion","name":"Health Potion","description":"Recover a minor amount of health","components":{"characterobject":{"color":"#990f02"},"healingConsumable":{"amount":4}}},{"id":"potion_mana","extends":"potion","name":"Mana Potion","description":"Recover a minor amount of mana","components":{"characterobject":{"color":"#020f99"},"manaConsumable":{"amount":4}}}]')},927:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_ring","extends":"base_item_mplus","components":{"characterobject":{"letter":"○","size":0.4},"equippable":{"slot":"ring"}}},{"id":"ring_of_health_weak","extends":"base_ring","name":"Weak Ring of Health","description":"Weak Ring of Health","components":{"characterobject":{"color":"#990f02"},"equippable":{"health":"1-10"}}},{"id":"ring_of_health","extends":"base_ring","name":"Ring of Health","description":"Ring of Health","components":{"characterobject":{"color":"#990f02"},"equippable":{"health":"5-30"}}},{"id":"ring_of_mana_weak","extends":"base_ring","name":"Weak Ring of Mana","description":"Weak Ring of Mana","components":{"characterobject":{"color":"#020f99"},"equippable":{"mana":"1-10"}}},{"id":"ring_of_mana","extends":"base_ring","name":"Ring of Mana","description":"Ring of Mana","components":{"characterobject":{"color":"#020f99"},"equippable":{"mana":"5-30"}}}]')},1786:e=>{"use strict";e.exports=JSON.parse('[{"id":"scroll","extends":"base_item","maxStackSize":20,"components":{"characterobject":{"letter":"~"}}},{"id":"scroll_lightning","extends":"scroll","name":"Lightning Scroll","description":"Shoots a bolt of lightning at the nearest enemy","components":{"characterobject":{"color":"#ffff00"},"damageNearestConsumable":{"damage":20,"maxRange":5}}},{"id":"scroll_confusion","extends":"scroll","name":"Confusion Scroll","description":"Confuse an enemy, causing them to wander aimlessly","components":{"characterobject":{"color":"#cf3fff"},"confusionConsumable":{"turns":10}}},{"id":"scroll_fireball","extends":"scroll","name":"Fireball Scroll","description":"Engulf an area in flames","components":{"characterobject":{"color":"#ff0000"},"aoeDamageConsumable":{"damage":12,"radius":1}}},{"id":"scroll_town_portal","extends":"scroll","name":"Scroll of Town Portal","description":"Summons a portal back to town","components":{"characterobject":{"color":"#0000ff"},"summonPortalConsumable":{}}}]')},9304:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_shield","extends":"base_item_mplus","components":{"equippable":{"slot":"offhand"}}},{"id":"round_shield","extends":"base_shield","name":"Round Shield","description":"Small round shield. Might block a few hits if used correctly","components":{"characterobject":{"letter":"●","color":"#ccc","size":0.6},"equippable":{"slot":"offhand","defense":"0-5","blockChance":"15-25"}}},{"id":"kite_shield","extends":"base_shield","name":"Kite Shield","description":"Kite Shield","components":{"characterobject":{"letter":"☗","color":"#555","size":0.6,"zRot":1},"equippable":{"slot":"offhand","defense":"0-25","blockChance":"20-35"}}},{"id":"tower_shield","extends":"base_shield","name":"Tower Shield","description":"Large rectangular shield. The surface is heavily scarred from battle","components":{"characterobject":{"fontName":"jetbrains","letter":"█","color":"#333","size":0.7},"equippable":{"defense":"0-50","blockChance":"30-50"}}}]')},2369:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_shoulder","extends":"base_item_mplus","components":{"characterobject":{"letter":"⌈"},"equippable":{"slot":"shoulder"}}},{"id":"cape","extends":"base_shoulder","name":"Cape","description":"Cape","components":{"characterobject":{"color":"#52307c"},"equippable":{"defense":"2-8"}}},{"id":"shoulder_pads","extends":"base_shoulder","name":"Shoulder Pads","description":"Shoulder Pads","components":{"characterobject":{"color":"#4f361b"},"equippable":{"defense":"6-15"}}},{"id":"spaulders","extends":"base_shoulder","name":"Spaulders","description":"Spaulders","components":{"characterobject":{"color":"#ddded8"},"equippable":{"defense":"12-25"}}},{"id":"pauldrons","extends":"base_shoulder","name":"Pauldrons","description":"Pauldrons","components":{"characterobject":{"color":"#dce5e7"},"equippable":{"defense":"22-35"}}}]')},6885:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_storage","extends":"base_item_mplus","components":{"characterobject":{"letter":"ひ","color":"#4f361b"},"equippable":{"slot":"storage"}}},{"id":"pouch_small","extends":"base_storage","name":"Small Pouch","description":"Small Pouch","components":{"equippable":{"maxStorage":10}}},{"id":"pouch_large","extends":"base_storage","name":"Large Pouch","description":"Large Pouch","components":{"equippable":{"maxStorage":20}}}]')},2542:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_weapon","extends":"base_item","components":{"equippable":{"slot":"mainhand"}}},{"id":"dagger","extends":"base_weapon","name":"Dagger","description":"","components":{"characterobject":{"letter":"†","color":"#4f361b","zRot":1},"equippable":{"damage":"1-2,3-4"}}},{"id":"short_sword","extends":"base_weapon","name":"Short Sword","description":"","components":{"characterobject":{"letter":"†","color":"#cccdce","zRot":1},"equippable":{"damage":"2-4,4-6"}}},{"id":"flail","extends":"base_weapon","name":"Flail","description":"","components":{"characterobject":{"fontName":"jetbrains","letter":"√","color":"#333","zRot":1},"equippable":{"damage":"2-3,7-9"}}},{"id":"long_sword","extends":"base_weapon","name":"Long Sword","description":"","components":{"characterobject":{"letter":"†","color":"#cccdce","zRot":1},"equippable":{"damage":"3-6,6-10"}}},{"id":"staff","extends":"base_weapon","name":"Staff","description":"","components":{"characterobject":{"fontName":"jetbrains","color":"#4f361b","letter":"|"},"equippable":{"damage":"1-4,5-9"}}}]')},8226:e=>{"use strict";e.exports=JSON.parse('[{"id":"base_solidtile","type":"tile","components":{"solidobject":{},"walkable":true,"blocksMovement":true,"blocksFov":true}},{"id":"base_charactertile","type":"tile","components":{"characterobject":{"fontName":"pressStart"},"walkable":false,"blocksMovement":true,"blocksFov":true}},{"id":"floor","extends":"base_solidtile","name":"Floor","components":{"solidobject":{"color":"#333333"}}},{"id":"floor_grass","extends":"base_solidtile","name":"Grass Floor","components":{"solidobject":{"color":"#567d46"}}},{"id":"floor_gravel","extends":"base_solidtile","name":"Gravel Floor","components":{"solidobject":{"color":"#858e8b"}}},{"id":"wall","extends":"base_charactertile","name":"Wall","components":{"characterobject":{"letter":"#","color":"#666666"}}},{"id":"door","extends":"base_charactertile","name":"Door","components":{"characterobject":{"letter":"+","color":"#964b00"},"blocksMovement":true,"blocksFov":true,"openable":{"isOpen":false,"openEntity":"door_open","closedEntity":"door"}}},{"id":"door_open","extends":"base_charactertile","name":"Door","components":{"characterobject":{"letter":"/","color":"#964b00"},"blocksMovement":false,"blocksFov":false,"openable":{"isOpen":true,"openEntity":"door_open","closedEntity":"door"}}},{"id":"stairs_north","extends":"base_charactertile","name":"Stairs","components":{"characterobject":{"letter":"/","color":"#ffffff","xRot":0.5,"yRot":0.5,"actorZOffset":0.5},"blocksMovement":false}},{"id":"stairs_west","extends":"base_charactertile","name":"Stairs","components":{"characterobject":{"letter":"/","color":"#ffffff","scale":".75","xRot":0.5,"yRot":1,"actorZOffset":0.5},"blocksMovement":false}},{"id":"water","extends":"base_charactertile","name":"Water","components":{"characterobject":{"letter":"≈","color":"#3333cc","scale":".7","actorZOffset":0.2},"blocksMovement":false,"blocksFov":false,"visibilityModifier":{"modifier":"*","amount":0.5}}},{"id":"art_backing","extends":"base_solidtile","name":"Backing","components":{"solidobject":{"scale":0.05,"color":"#000000"}}},{"id":"art","extends":"base_charactertile","name":"Art","components":{"characterobject":{"scale":0.1,"xOffset":-0.5,"yOffset":-0.65,"zOffset":-0.05,"centered":false},"blocksFov":false,"blocksMovement":false}}]')},6853:e=>{"use strict";e.exports=JSON.parse('[{"id":"grass1","extends":"base_charactertile","name":"Grass","components":{"characterobject":{"fontName":"mplus","letter":"░","color":"#567d46","scale":"0.1, 0.75","size":0.85},"blocksMovement":false,"blocksFov":false}},{"id":"grass2","extends":"base_charactertile","name":"Grass","components":{"characterobject":{"fontName":"mplus","letter":"⺌","color":"#567d46","scale":0.1,"size":0.85,"xRot":0.5,"zOffset":0.05,"yRot":"0,2"},"blocksMovement":false,"blocksFov":false}},{"id":"grass3","extends":"base_charactertile","name":"Grass","components":{"characterobject":{"fontName":"mplus","letter":"⺍","color":"#567d46","scale":0.1,"size":0.85,"xRot":0.5,"zOffset":0.05,"yRot":"0,2"},"blocksMovement":false,"blocksFov":false}},{"id":"grass4","extends":"base_charactertile","name":"Grass","components":{"characterobject":{"fontName":"mplus","letter":"⺣","color":"#567d46","scale":0.1,"size":0.85,"xRot":-0.5,"zOffset":0.05,"yRot":"0,2"},"blocksMovement":false,"blocksFov":false}},{"id":"tree_trunk","extends":"base_charactertile","name":"Tree Trunk","components":{"characterobject":{"fontName":"mplus","letter":"⚫","color":"#964b00","size":0.85}}},{"id":"tree_leaves","extends":"base_charactertile","name":"Tree Leaves","components":{"characterobject":{"fontName":"mplus","letter":"░","color":"#618a3d","size":0.85}}},{"id":"stone","extends":"base_charactertile","name":"Stone","components":{"characterobject":{"fontName":"mplus","letter":"▪","scale":0.05,"size":0.35,"color":"#666","xOffset":"-0.25, 0.25","yOffset":"-0.25, 0.25","zRot":"0,2"},"blocksFov":false,"blocksMovement":false}}]')},4002:e=>{"use strict";e.exports=JSON.parse('[{"id":"bench_south","extends":"base_charactertile","name":"Bench","components":{"characterobject":{"fontName":"mplus","letter":"厂","color":"#964b00","size":0.85,"xRot":1.5,"yRot":0.5,"zRot":0,"zOffset":0.47,"actorZOffset":0.6},"blocksMovement":false,"walkable":false,"blocksFov":false}},{"id":"bench_south_left","extends":"base_charactertile","name":"Bench","components":{"characterobject":{"characters":[{"letter":"厂","xRot":1.5,"yRot":0.5,"zOffset":0.47},{"letter":"巳","scale":0.1,"xRot":0.5,"yRot":0.5,"zOffset":0.03,"xOffset":0.51}],"fontName":"mplus","color":"#964b00","size":0.85,"actorZOffset":0.6},"blocksFov":false,"blocksMovement":false}},{"id":"bench_south_right","extends":"base_charactertile","name":"Bench","components":{"characterobject":{"characters":[{"letter":"厂","xRot":1.5,"yRot":0.5,"zOffset":0.47},{"letter":"巳","scale":0.1,"xRot":0.5,"yRot":0.5,"zOffset":0.03,"xOffset":-0.51}],"fontName":"mplus","color":"#964b00","size":0.85,"actorZOffset":0.6},"blocksFov":false,"blocksMovement":false}},{"id":"bench_stone","extends":"base_charactertile","name":"Stone Bench","components":{"characterobject":{"letter":"п","color":"#bbb","xRot":0.5,"yRot":0.5},"walkable":true,"blocksFov":false}},{"id":"well","extends":"base_charactertile","name":"Well","components":{"characterobject":{"characters":[{"letter":"○","color":"#666"},{"letter":"个","color":"#6c3f20","xRot":0.5,"yRot":0.25,"zOffset":0.4}],"fontName":"mplus","size":0.75,"scale":0.62},"blocksFov":false,"blocksMovement":true}},{"id":"barrel","extends":"base_charactertile","name":"Barrel","components":{"characterobject":{"fontName":"mplus","letter":"○","color":"#6c3f20","size":0.55,"scale":0.7},"blocksFov":false,"blocksMovement":true}},{"id":"table","extends":"base_charactertile","name":"Table","components":{"characterobject":{"fontName":"mplus","letter":"π","color":"#6c3f20","size":1,"scale":1,"xRot":0.5},"blocksFov":false,"blocksMovement":true}},{"id":"portal","extends":"base_charactertile","name":"Portal","components":{"characterobject":{"characters":[{"letter":"◌","animateIn":{"time":1000,"zRotation":0.5,"start":{"scale":0},"end":{"scale":1}},"animations":[{"time":1000,"zRotation":0.5,"start":{"scale":1},"end":{"scale":0.5}},{"time":1000,"zRotation":0.5,"start":{"scale":0.5},"end":{"scale":1}}]},{"letter":"⁐","animateIn":{"time":1000,"zRotation":2,"start":{"scale":0},"end":{"scale":1}},"animations":[{"time":1000,"zRotation":2,"end":{"scale":0.9}},{"time":1000,"zRotation":2,"end":{"scale":1}}]}],"fontName":"mplus","color":"#3333ff","xRot":0.5,"yRot":0.25,"scale":0.05,"zOffset":0.5},"blocksFov":false,"blocksMovement":false}},{"id":"fence_vertical","extends":"base_charactertile","name":"Fence","components":{"characterobject":{"letter":"#","color":"#6c3f20","xRot":0,"yRot":0.5,"scale":0.1,"zOffset":0.45},"blocksFov":false,"blocksMovement":true}},{"id":"post","extends":"base_charactertile","name":"Post","components":{"characterobject":{"letter":"|","color":"#6c3f20","xRot":0.5,"scale":0.3,"zOffset":0.4},"blocksFov":false,"blocksMovement":true}}]')}}]);