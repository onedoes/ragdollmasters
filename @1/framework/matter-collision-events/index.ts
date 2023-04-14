//

import debug from "debug";
import type { Engine, IEventCollision, Plugin } from "matter-js";
import Matter from "matter-js";

//

const log = debug("@1.framework:matter-collision-events");

//

export const MatterCollisionEventsPlugin = {
  ...({
    name: "matter-collision-events",
    version: "0.0.0",
    for: "matter-js@^0.19.0",
    install() {
      const base = arguments[0];
      log("install", { base });
      // base.after("Body.create", function () {
      //   MatterCollisionEventsPlugin.Body.init(this);
      // });

      base.before("Engine.create", function (engine: Engine) {
        MatterCollisionEventsPlugin.Engine.create(engine);
      });
      base.before("Engine.clear", function (engine: Engine) {
        MatterCollisionEventsPlugin.Engine.clear(engine);
      });
      // matter.after('Engine.create', function() {
      //   matter.Events.on(this, 'collisionStart', function(event) {
      //     event.pairs.map(function(pair) {
      //       matter.Events.trigger(pair.bodyA, 'onCollide', { pair : pair });
      //       matter.Events.trigger(pair.bodyB, 'onCollide', { pair : pair });
      //       pair.bodyA._mceOC &&
      //         pair.bodyA._mceOC(pair)
      //       pair.bodyB._mceOC &&
      //         pair.bodyB._mceOC(pair)
      //     });
      //   });
      // }
    },
  } satisfies Plugin),
  Engine: {
    create: function (engine: Engine) {
      log("MatterCollisionEventsPlugin.Engine.create > ", engine, this);
      Matter.Events.on(
        engine,
        "collisionStart",
        this._triggerCollisionStartBodies
      );
    },
    clear: function (engine: Engine) {
      log("MatterCollisionEventsPlugin.Engine.clear > ", engine, this);
      Matter.Events.off(
        engine,
        "collisionStart",
        this._triggerCollisionStartBodies
      );
    },

    //

    _triggerCollisionStartBodies(event: IEventCollision<Engine>) {
      for (const pair of event.pairs) {
        Matter.Events.trigger(pair.bodyA, "collisionStart", { pair: pair });
        Matter.Events.trigger(pair.bodyB, "collisionStart", { pair: pair });
      }
    },
  },
};
