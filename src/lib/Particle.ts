import Matter, { Body } from "matter-js";

export class Particle {
  body: Body;
  life = 1;
  constructor(x: number, y: number, r: number) {
    this.body = Matter.Bodies.circle(x, y, r, {
      friction: 0,
      restitution: 0.5,
      frictionAir: 0.001,
      density: 0.001,
      render: { fillStyle: "#f00", opacity: 1 },
      collisionFilter: { category: 0 },
    });
  }
  update(event: Matter.IEventTimestamped<Matter.Engine>) {
    const timeScale = ((event as any).delta || 1000 / 60) / 10000;
    this.life -= timeScale;
    this.body.render.opacity = this.life;
  }
}
