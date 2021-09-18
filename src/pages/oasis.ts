import {
  Camera,
  MeshRenderer,
  PrimitiveMesh,
  Script,
  Sprite,
  SpriteRenderer,
  Texture2D,
  UnlitMaterial,
  Vector3,
  WebGLEngine,
} from 'oasis-engine';

const _ = require('lodash');

export const runOasis = async () => {
  // 初始化引擎实例
  const engine = new WebGLEngine('canvas');
  engine.canvas.resizeByClientSize();
  // 创建场景根节点
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity('root');
  // 创建相机
  const cameraEntity = rootEntity.createChild('camera_entity');
  cameraEntity.transform.position = new Vector3(0, 0, 10);
  const camera = cameraEntity.addComponent(Camera);
  camera.isOrthographic = true;
  // 创建平面背景
  const planeEntity = rootEntity.createChild('plane');
  const planeRender = planeEntity.addComponent(MeshRenderer);
  planeRender.mesh = PrimitiveMesh.createPlane(
    engine,
    camera.orthographicSize * camera.aspectRatio * 2,
    camera.orthographicSize * 2,
  );
  const planeMaterial = new UnlitMaterial(engine);
  planeMaterial.baseTexture = await engine.resourceManager.load<Texture2D>(
    '/bg.jpg',
  );
  planeRender.setMaterial(planeMaterial);
  // 创建月饼精灵
  for (let index = 0; index < 10; index++) {
    const moonCakeEntity = rootEntity.createChild(`moonCake-${index}`);
    moonCakeEntity.transform.setScale(0.2, 0.2, 0.2);
    const moonCakeRender = moonCakeEntity.addComponent(SpriteRenderer);
    moonCakeRender.sprite = new Sprite(
      engine,
      await engine.resourceManager.load<Texture2D>('/moonCake.png'),
    );
    moonCakeEntity.addComponent(MoonCakeScript);
  }
  // 运行引擎
  engine.run();
};

// 月饼脚本
class MoonCakeScript extends Script {
  // @ts-ignore
  camera = this.engine.sceneManager.activeScene._activeCameras[0] as Camera;
  x = this.camera.orthographicSize * this.camera.aspectRatio;
  y = this.camera.orthographicSize;
  resetPosition = () => {
    const randomX = _.random(-this.x, this.x);
    const randomSubY = _.random(1, 100);
    this.entity.transform.setPosition(randomX, this.y + randomSubY, 1);
  };
  onStart() {
    super.onStart();
    this.resetPosition();
  }

  onUpdate(deltaTime: number) {
    super.onUpdate(deltaTime);
    const randomSubY = _.random(0.3, 0.5);
    if (this.entity.transform.position.y < -this.y) {
      this.resetPosition();
    }
    this.entity.transform.setPosition(
      this.entity.transform.position.x,
      this.entity.transform.position.y - randomSubY,
      1,
    );
  }
}
