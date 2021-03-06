const theme = {
  hill: {
    spring: ['#7CFC00', '#bce475'],
    summer: ['#009900', '#000000'],
    fall: ['#ffb415', '#006666'],
    winter: ['#ffffff', '#006666']
  },
  mount: {
    spring: ['#009900', '#006666'],
    summer: ['#006666', '#000000'],
    fall: ['#ff8d00', '#006666'],
    winter: ['#ffffff', '#006666']
  }
}

;(function() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const snap = Snap("#scene");

  const shadow = snap.filter(Snap.filter.shadow(10, -10, 10, '#000', 0.8));

  const EASE = Bounce.easeOut;

  season = localStorage.season || 'spring';
  document.querySelector(`.options .btn[data-role=${season}]`).className = 'btn active';

  document.querySelector('.options').addEventListener('click', function() {
    const s = event.target.getAttribute('data-role');
    if (s === season) {
      return;
    }
    if (['spring', 'summer', 'fall', 'winter'].includes(s)) {
      season = s;
      localStorage.season = season;
      document.querySelector('.options .btn.active').className = 'btn';
      event.target.className = 'btn active';
    } else if ([].includes(s)) {

    } else {
      return;
    }

    // 重绘
    Snap.selectAll('.cloud').remove();
    Snap.selectAll('.sun').remove();
    Snap.selectAll('.mount').remove();
    Snap.selectAll('.hill').remove();
    Snap.selectAll('.tree').remove();
    Snap.selectAll('.bike').remove();
    draw();
  })

  let sense = Snap.set();
  draw();

  function draw() {
    const skys = [];
    const trees = [];
    const hills = [];
    const mounts = [];

    // 创建山
    const ms = Snap.color(theme.mount[season][0]).hex;
    const me = Snap.color(theme.mount[season][1]).hex;
    mounts.push(createHill(0, 0, h - 100, ms, me));
    mounts.push(createHill(-w / 3, 0, h - 200, ms, me));
    mounts.push(createHill(w / 3, 0, h - 300, ms, me));

    // 创建坡
    const hs = Snap.color(theme.hill[season][0]).hex;
    const he = Snap.color(theme.hill[season][1]).hex;
    hills.push(createHill(0, 0, 200, hs, he));

    // 创建树
    // trees.push(createTree(w / 2, h - 220, Math.min(1.2, w / 3 / 150)));

    hills.push(createHill(-w / 3, 0, 150, hs, he));
    hills.push(createHill(w / 3, 0, 100, hs, he));

    // 创建树
    // trees.push(createTree(w * 0.1, h - 150, Math.min(1, w / 3 / 150)));

    // 创建太阳
    skys.push(createSun(w - 150 - w * 0.05, h * 0.03, 0.8));

    // 创建云
    skys.push(createCloud(w * 0.05, 50));
    skys.push(createCloud(w * 0.6, 100));
    skys.push(createCloud(w * 0.3, 200, 1.2));

    // 动画
    for (let i = 0; i < skys.length; i++) {
      TweenMax.from(skys[i].node, 1.5, {
        y: `-=${h / 2}`,
        delay: Math.random(),
        ease: EASE,
      });
    }

    for (let pic of [...trees, ...hills, ...mounts]) {
      TweenMax.from(pic.node, 2, {
        y: `+=${h}`,
        delay: Math.random(),
        ease: EASE,
      });
    }

    createBike([...hills, ...mounts]);
  }

  function createCloud(x, y, scale = 1) {
    const transform = Snap.matrix().translate(x, y).scale(scale).toTransformString();
    const cloud = snap.g().addClass('cloud').attr({filter: shadow}).transform(transform);
    const cloudBody = cloud.g().addClass('cloud-body');
    cloudBody.path('m99.00396,1.25a31.47719,31.63598 0 0 0 -26.3226,14.3278a23.78195,23.89188 0 0 0 -14.87746,-5.27673a23.78195,23.89188 0 0 0 -23.41551,19.84883a29.32741,29.47398 0 0 0 -3.79876,-0.26872a29.32741,29.47398 0 0 0 -29.33962,29.47398a29.32741,29.47398 0 0 0 29.35184,29.46177a29.32741,29.47398 0 0 0 12.5811,-2.89488a23.78195,23.89188 0 0 0 19.48239,10.23589a23.78195,23.89188 0 0 0 16.39208,-6.60813a23.78195,23.89188 0 0 0 16.37986,6.60813a23.78195,23.89188 0 0 0 18.24871,-8.58691a23.78195,23.89188 0 0 0 18.22428,8.58691a23.78195,23.89188 0 0 0 23.76974,-23.87967a23.78195,23.89188 0 0 0 -9.9916,-19.43353a23.78195,23.89188 0 0 0 2.60172,-10.80998a23.78195,23.89188 0 0 0 -21.37566,-23.76974a31.47719,31.63598 0 0 0 -27.91051,-17.01503l0,0.00001z')
      .attr({
        stroke: '#000',
        strokeWidth: 0,
        strokeLinejoin: 'round',
        strokeLinecap: 'round',
      });

    // const cloudFace = cloud.g().addClass('cloud-face');
    // const eye = cloudFace.g().addClass('cloud-eye');
    // eye.path('m65.84001,52.86a2.87,2.87 0 0 1 -2.87,2.87a2.87,2.87 0 0 1 -2.87,-2.87a2.87,2.87 0 0 1 2.87,-2.88a2.87,2.87 0 0 1 2.88,2.88l-0.01,0z');
    // eye.path('m62.85001,51.8a0.94,0.94 0 0 1 -0.94,0.93a0.94,0.94 0 0 1 -0.93,-0.93a0.94,0.94 0 0 1 0.93,-0.94a0.94,0.94 0 0 1 0.94,0.94z').attr({
    //   fill: '#fff'
    // });

    // eye.clone().transform('translate(30, 0)');

    // const cloudMouth = cloudFace.g().addClass('cloud-mouth');
    // cloudMouth.path('m82.09001,54.65a4.02,3.28 0 0 1 -4.02,3.28a4.02,3.28 0 0 1 -4.02,-3.28').attr({
    //   fill: 'none',
    //   strokeLinejoin: 'round',
    //   strokeLinecap: 'round',
    // });

    // const cheek = cloudFace.g().addClass('cloud-cheek');
    // cheek.circle(52.1, 55.96, 2.71).attr({
    //   fill: '#faa',
    //   fillOpacity: 0.5,
    // });
    // cheek.clone().transform('translate(52, 0)');
    return cloud;
  }

  function createSun(x, y, scale = 1) {
    const transform = Snap.matrix().translate(x, y).scale(scale).toTransformString();
    const sun = snap.g().addClass('sun').attr({
      stroke: '#000',
      strokeWidth: 0,
      filter: shadow,
    }).transform(transform);
    sun.path(`m17.63653,137.61925c-9.45453,-23.27268 -5.81817,-50.18172 -1.09091,-71.63622c4.72726,-21.45451 18.54542,-34.18175 34.54539,-41.09083c15.99996,-6.90908 39.63628,-18.90905 77.45439,-10.1818c37.8181,8.72726 45.09082,30.90903 55.27261,51.27263c10.1818,20.36359 -1.81817,69.81804 -7.99998,82.54528c-6.18181,12.72725 -45.45445,40.36356 -67.27259,41.8181c-21.81814,1.45455 -53.09081,-15.27269 -67.99987,-22.18177c-14.90906,-6.90908 -13.45452,-7.27271 -22.90904,-30.54539z`).attr({
      fill: '#FF4500',
    });
    sun.text(15, 55, '').transform('scale(2)');
    return sun;
  }

  function createHill(x, y, height, colorStart, colorEnd) {
    const transform = Snap.matrix().translate(x, y).toTransformString();
    const hill = snap.g().addClass('hill').attr({
      strokeWidth: 0,
    }).transform(transform);
    const k = () => Math.random() / 4 + 0.125;
    hill.path(`M0 ${h} Q${k() * w} ${h - height} ${w / 2} ${h - height} Q${ (1 - k()) * w} ${h - height} ${w} ${h}`).attr({
      fill: snap.gradient(`l(0, 0, 0, 1)${colorStart}-${colorEnd}`),
      filter: shadow
    });
    return hill;
  }

  function createTree(x, y, scale = 1) {
    const transform = Snap.matrix().translate(x, y).scale(scale, scale, 75, 150).toTransformString();
    const tree = snap.g().addClass('tree').transform(transform);

    tree.path('m90.371555,152.355557c-20.196553,-32.474219 7.488451,-43.888049 7.488451,-43.888049s-2.292289,-3.695617 -3.668037,-1.693746c-1.375124,2.001662 -9.475157,5.081657 -9.169574,3.849575s7.641658,-7.392073 7.641658,-7.392073l-1.375332,-3.54145s-9.169574,10.163733 -10.239738,8.777693c-1.069957,-2.771661 3.667829,-11.087481 3.667829,-11.087481l-6.724493,-3.696036s0,6.775822 -1.222333,13.089561s-4.737994,3.696036 -4.737994,3.696036l-1.222333,-17.863303l-5.808159,1.232082l0.764997,19.556839l-14.824733,-14.937056l-4.737578,4.003324c4.279204,3.387911 14.747818,13.474561 11.614655,12.011647c-2.445081,-2.926247 -14.518318,-6.159572 -14.518318,-6.159572l0,2.617912s13.907152,1.847913 19.867479,13.705393c7.275374,17.200341 -9.787808,26.139952 -12.722238,27.52683c-0.270659,0.128822 -0.420749,0.191871 -0.420749,0.191871l40.346332,0l0.000208,0z')
      .attr({
        fill: '#593003',
        filter: shadow,
      });
    tree.path('m43.770123,105.503976s1.394041,10.20814 -6.04826,12.552699c-7.442093,2.344558 -13.068565,-1.659603 -15.39765,-7.017128c-0.262344,-0.486381 -12.335166,5.549186 -19.118281,-6.23896c-6.783115,-11.788774 -0.826945,-16.06231 0.024946,-16.917771c0.851891,-0.855671 -5.302595,-6.432297 0.869769,-13.062331c0,0 3.565968,-4.143247 9.38369,-3.813547c1.038359,-1.524288 -2.294992,-11.245837 6.873958,-13.480845c-0.555039,-2.008365 -8.32974,-25.307742 13.984691,-25.596806c-1.268066,-4.390418 8.315188,-17.975786 19.455461,-6.395012c0,0 9.69842,-18.507622 24.548514,-0.711348c1.488419,-0.319855 7.872404,-6.626892 15.08583,2.164417c-0.206217,-4.1776 25.736131,-13.454033 28.249604,11.392464c3.719799,-0.424379 9.557685,4.188911 8.058457,11.576166c0,0 12.668813,1.516537 7.839144,16.499676c12.751341,0.233346 18.454729,23.798745 2.719067,29.343114c0,0 -2.357356,13.273263 -15.737117,6.828608c0,0 -5.111762,7.487589 -12.33184,3.83596c0,0 -13.940413,13.175862 -21.71054,-3.850832c0,0 -9.899231,1.581472 -11.404281,-5.086265c-2.15696,3.530348 -12.221871,4.961004 -14.514161,-0.824251c-1.035865,6.98487 -6.775215,7.698732 -11.234235,4.961633c-2.928194,7.102171 -9.039233,4.001648 -9.596559,3.840149l-0.000208,0.000209z')
      .attr({
        fill: '#5B820F',
        filter: shadow,
      });
    tree.path('m50.400843,98.207553s1.059391,7.956728 -4.534984,9.792923c-5.594538,1.836535 -9.830309,-1.278404 -11.587917,-5.452208c-0.19779,-0.379297 -9.270692,4.340374 -14.385023,-4.841789s-0.640005,-12.52107 0,-13.189056c0.639189,-0.667986 -3.995423,-5.00836 0.639189,-10.184142c0,0 2.677421,-3.234332 7.05277,-2.983965c0.77942,-1.189498 -1.738204,-8.764545 5.154769,-10.517794c-0.419713,-1.565219 -6.293081,-19.719885 10.488902,-19.971444c-0.958784,-3.421681 6.233727,-14.023953 14.624719,-5.00836c0,0 7.273225,-14.440039 18.461486,-0.583508c1.118581,-0.251218 5.913154,-5.175953 11.347895,1.669624c-0.159797,-3.256473 19.340371,-10.518816 21.258428,8.848511c2.796943,-0.335526 7.192511,3.254259 6.073441,9.015252c0,0 9.529629,1.167527 5.914133,12.853871c9.590124,0.166911 13.905631,18.53192 2.077692,22.872635c0,0 -1.758423,10.350713 -11.827939,5.342012c0,0 -3.835952,5.843598 -9.270203,3.005425c0,0 -10.469498,10.288206 -16.332267,-2.976641c0,0 -7.443295,1.244341 -8.582259,-3.95205c-1.618519,2.754717 -9.186391,3.88205 -10.916768,-0.625747c-0.771267,5.446758 -5.086774,6.009998 -8.44317,3.881539c-2.194279,5.540432 -6.79367,3.130097 -7.213057,3.005084l0.000163,-0.00017z')
      .attr({
        fill: '#7BB713',
        filter: shadow,
      });
    return tree;
  }

  function createBike(hills) {
    const bike = snap.g().addClass('bike').hover(() => {
      light.addClass('light--active');
      // umbrella.setDirection(1);
      // umbrella.play();
    }, () => {
      light.removeClass('light--active');
      // umbrella.setDirection(-1);
      // umbrella.play();
    });
    const container = bike.g().attr({transform: 'translate(-20, -40)'});
    const light = container.image('./img/light.png', 30, 12, 45, 20).addClass('light');
    const bmContainer = container.g().attr({transform: 'scale(0.07)'});
    const umbrellaAnimation = bmContainer.g().attr({transform: 'translate(0, -180)'});
  
    bodymovin.loadAnimation({
      container: bmContainer.node,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: './data/bike.json',
    }).setSpeed(1);
  
    const umbrella = bodymovin.loadAnimation({
      container: umbrellaAnimation.node,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: './data/umbrella.json',
    });

    umbrella.setSpeed(2);
  
    const run = (idx) => {
      const hill = hills[idx];
      bike.remove();
      bike.appendTo(hill);
      const path = anime.path(hill.children()[0]);

      anime({
        targets: bike.node,
        translateX: path('x'),
        translateY: path('y'),
        rotate: path('angle'),
        easing: 'linear',
        duration: 15000,
        loop: false,
        complete: function() {
          run((idx + 1) % hills.length);
        }
      });
    }

    run(0);
  }
})();
