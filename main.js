(function() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const snap = Snap("#scene");

  const shadow = snap.filter(Snap.filter.shadow(0, -10, 10, '#000', 0.8));

  function createCloud() {
    const cloud = snap.g().addClass('cloud').attr({filter: shadow});
    const cloudBody = cloud.g().addClass('cloud-body');
    cloudBody.path('m99.00396,1.25a31.47719,31.63598 0 0 0 -26.3226,14.3278a23.78195,23.89188 0 0 0 -14.87746,-5.27673a23.78195,23.89188 0 0 0 -23.41551,19.84883a29.32741,29.47398 0 0 0 -3.79876,-0.26872a29.32741,29.47398 0 0 0 -29.33962,29.47398a29.32741,29.47398 0 0 0 29.35184,29.46177a29.32741,29.47398 0 0 0 12.5811,-2.89488a23.78195,23.89188 0 0 0 19.48239,10.23589a23.78195,23.89188 0 0 0 16.39208,-6.60813a23.78195,23.89188 0 0 0 16.37986,6.60813a23.78195,23.89188 0 0 0 18.24871,-8.58691a23.78195,23.89188 0 0 0 18.22428,8.58691a23.78195,23.89188 0 0 0 23.76974,-23.87967a23.78195,23.89188 0 0 0 -9.9916,-19.43353a23.78195,23.89188 0 0 0 2.60172,-10.80998a23.78195,23.89188 0 0 0 -21.37566,-23.76974a31.47719,31.63598 0 0 0 -27.91051,-17.01503l0,0.00001z')
      .attr({
        stroke: '#000',
        strokeWidth: 1,
        strokeLinejoin: 'round',
        strokeLinecap: 'round',
      });

    const cloudFace = cloud.g().addClass('cloud-face');
    const eye = cloudFace.g().addClass('cloud-eye');
    eye.path('m65.84001,52.86a2.87,2.87 0 0 1 -2.87,2.87a2.87,2.87 0 0 1 -2.87,-2.87a2.87,2.87 0 0 1 2.87,-2.88a2.87,2.87 0 0 1 2.88,2.88l-0.01,0z');
    eye.path('m62.85001,51.8a0.94,0.94 0 0 1 -0.94,0.93a0.94,0.94 0 0 1 -0.93,-0.93a0.94,0.94 0 0 1 0.93,-0.94a0.94,0.94 0 0 1 0.94,0.94z').attr({
      fill: '#fff'
    });

    eye.clone().transform('translate(30, 0)');

    const cloudMouth = cloudFace.g().addClass('cloud-mouth');
    cloudMouth.path('m82.09001,54.65a4.02,3.28 0 0 1 0,0.08a4.02,3.28 0 0 1 -4.02,3.28a4.02,3.28 0 0 1 -4.02,-3.28l0,0a4.02,3.28 0 0 1 0,-0.08').attr({
      fill: 'none',
      strokeLinejoin: 'round',
      strokeLinecap: 'round',
    });

    const cheek = cloudFace.g().addClass('cloud-cheek');
    cheek.circle(52.1, 55.96, 2.71).attr({
      fill: '#faa',
      fillOpacity: 0.5,
    });
    cheek.clone().transform('translate(52, 0)')

  }

  function createHill() {
    const hill = snap.g().addClass('hill').attr({
      stroke: '#000',
      strokeWidth: 2,
    });
    hill.path(`M${w / 3} ${h} Q${2 * w / 3} ${h - 200} ${w} ${h - 200} V${h}Z`).attr({
      fill: '#308014',
      filter: shadow
    })
    hill.path(`M0 ${h - 100} Q${w / 3} ${h - 100} ${2 * w / 3} ${h} H0Z`).attr({
      fill: '#6B8E23',
      filter: shadow
    });
  }

  createCloud();
  createHill();
  
})();
