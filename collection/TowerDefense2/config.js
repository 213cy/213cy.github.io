config = {
    enemy: {},
    turret: {},
    ability: {},
    buff: {}
}

config.ability = {
    template: {
        buff: "",
        issue: (target)=>{}
    },
    cluster: {
        issue: function(issuer,target,point) {
            if (target) {
                return this.buff
            }
        }
        ,
        buff: "split"
    },
    trace: {
        issue: function(issuer,target,point) {
            return this.buff
        }
        ,
        buff: "lock"
    },
    spark: {
        buff: "flame"
    },
    venom: {
        buff: "poison"
    }
}

// buff
config.buff = {
    template: {
        dur: 0,
        effect: ()=>{}
    },
    split: {
        n: 20
    },
    lock: {},
    flame: {
        dur: 200
    },
    poison: {
        dur: 200
    },
}

// enemies
config.enemy.basic = {
    speed: 2,
    color: "black",
    Maxhp: 50,
    size: 16,
}
