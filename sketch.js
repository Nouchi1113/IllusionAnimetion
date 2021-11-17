var imgcount = 0;
var diff = 4;//どれぐらいずらすか

var rangedata = [];

var PixelData = [];

var img0, img1, img2, img3, img, Kotei, Jiyu, Sakujo, imgOriginal;

var count = 0;

var framerate = 10;//framerate
var speed = 4;
var fm = 5;//framerateをいい感じにする変数

var Mang;
var ang = [];//Moveangle,一つ目の画像の角度，２つ目

var Efx, Efy;//embossを行う最初のピクセル座標
var efx, efy;//embossを行う最初のピクセル座標（現在の）
var elx, ely;//embossを行う最初のピクセル数座標（現在の）

//動かす許可
var move = false;
//パート機能を使っていた場合
var part = false;
//複数のパート機能を使う場合
var MulchMode = false;

var gx, gy, nx, ny;//xy方向に何ピクセルずらすか（g:グレースケール，n：ネガポジ）

var x = -10, y = -10, ax = -10, ay = -10;//四角・円に使用する４変数

var allpart = false;//全画面選択を一度でも使ったかどうか

var mode = 0;//領域選択をrectにするかellipseにするか

var framemode = true;//frameを固定する(true)かしない(false)か

var imgx, imgy, imgEx, imgEy;  //画像の座標

var rangesize;//前フレームのrangedata.size()を保存する変数

var framemodespeed = 3;//framemode(true)で使うspeedの変数

var savepixel;

var LassoPixelX = [];
var LassoPixelY = [];
var LassoPixelXX = [];
var LassoPixelYY = [];
var Rasso = 0;//Rassoのpiselデータを繋ぐ番号

var hozon = false;//保存時にtrueになる

var po = 0;

var input;

var syorityu = false;
//元画像の大きさ
var originalWidth;
var originalheight;

let isRecording = false;
var hiquality = true;
var mp4 = false;
//運動方法の初期値
var Movemode = 0;
//右メニューに作る画像データ
var rangeImage = [];

//右メニューの座標
var rmx = 1000;
var rmy = 60;
var rmex = 1190;
var rmey = 790;

//右メニューに表示する最初の画像の番号
var rfn = 0;
//範囲を見えるようにするかのフラグ
var vis = true;

//出力時のステップ段階
var ExportStep = 0;
var hozonWidth, hozonHeight;
var gif = false;

//出力する動画フォーマット
var Format = 'gif';


var capturer = new CCapture({
  format: 'webm',
  framerate: framerate,
  verbose: true,
  name: 01,
  timeLimit: 20
});
var canvas;

//保存するフレーム数
var saveFrame;

let allsteps;


function preload() {
  //変数を使って画像をロード
  img = loadImage("bike.jpg");
  imgOriginal = loadImage("bike.jpg");
  Kotei = loadImage("Kotei.png");
  Jiyu = loadImage("Jiyu.png");
  Sakujo = loadImage("Sakujo.png");
}

function setup() {
  frameRate(framerate);
  var p5Canvas = createCanvas(1200, 800);
  canvas = p5Canvas.canvas;
  textFont("Meiryo", 50);

  Kotei.resize(105, 50);
  Jiyu.resize(105, 50);

  Sakujo.resize(70, 70);
  originalWidth = img.width;
  originalheight = img.height;

  imageReset(img);

  savepixel = [];//Moveangle,一つ目の画像の角度，２つ目

  input = createFileInput(handleFile);
  input.position(30, 30);

}

function imageLoaded() { //

  img.resize(400, 0);

  if (img.width >= 400) {
    img.resize(400, 0);
  } else if (img.height >= 300) {
    img.resize(0, 300);
  }
}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = loadImage(file.data, imageLoaded);
    originalWidth = img.width;
    soriginalheight = img.height;
    imageReset(img);
  } else {
    img = null;
  }
}




function draw() {
  framerate = Number(document.getElementById("number2").value);
  frameRate(framerate);

  //エッジ計算
  //document.getElementById("Edge").value = diff;
  //document.getElementById("DPI").value = Math.round(diff * 25.4 / 1.12);
  // diff = Number(document.getElementById("Edge").value);
  if (rangedata.length == 0) {
    diff = Math.round(1.12 / (25.4 / Number(document.getElementById("DPI").value)));
  }
  if (hozon) {
    if (ExportStep < allsteps) {

      ExportStep++;
      Export(hozonWidth, hozonHeight, ExportStep);

    } else {
      if (imgcount % 4 == 0) {
        image(img0, 0, 0);
      } else if (imgcount % 4 == 1) {
        image(img1, 0, 0);
      } else if (imgcount % 4 == 2) {
        image(img2, 0, 0);
      } else if (imgcount % 4 == 3) {
        image(img3, 0, 0);
      }

      if (mp4 && imgcount == 0) {
        capturer.start();
      }

      if (imgcount <= saveFrame) {　//4秒後Captureを停止する
        capturer.capture(document.getElementById('defaultCanvas0'));
      }
      else if (mp4 && imgcount == saveFrame + 1) {
        capturer.save();
        capturer.stop();
      }

      imgcount++;
      //console.log(imgcount);

    }
  } else {

    document.getElementById("Twitter").style.display = "none";

    background(70);

    //GUI
    stroke(140);
    strokeWeight(1);
    fill(31, 30, 99);
    rect(10, 10, 1180, 780);//上部の四角

    fill(140);
    stroke(162, 162, 173);
    rect(200, 60, 990, 730);//画像背景
    fill(220, 213, 200);


    rect(10, 60, 190, 730);//左のメニューバ-

    stroke(140);
    textSize(20);
    fill(31, 30, 99);
    text("領域選択", 65, 95);
    fill(237, 234, 227);
    noStroke();
    rect(20, 105, 170, 170, 5);//領域選択のアイコン背景


    stroke(140);
    fill(31, 30, 99);
    text("運動方法", 65, 315);
    fill(237, 234, 227);
    noStroke();
    rect(20, 325, 170, 255, 5);//運動速度のアイコン選択

    stroke(140);
    fill(31, 30, 99);
    text("領域削除", 65, 625);
    image(Sakujo, 70, 640);

    //領域選択
    if (mode == 0) {
      fill(99, 98, 30);
      rect(40, 120, 130, 60);
    }


    if (mode == 1) {
      fill(99, 98, 30);
      rect(40, 195, 130, 60);
    }


    //運動中止
    fill(143, 170, 220);


    //運動速度
    if (Movemode == 0) {
      fill(99, 98, 30);
      rect(30, 340, 75, 60);
    } else if (Movemode == 1) {
      fill(99, 98, 30);
      rect(105, 340, 75, 60);
    } else if (Movemode == 2) {
      fill(99, 98, 30);
      rect(30, 420, 75, 60);
    } else if (Movemode == 3) {
      fill(99, 98, 30);
      rect(105, 420, 75, 60);
    } else if (Movemode == 4) {
      fill(99, 98, 30);
      rect(30, 500, 75, 60);
    }

    //メニューバーのアイコン
    fill(20);
    rect(60, 130, 90, 40);//四角アイコン
    ellipse(105, 225, 50, 50);//丸アイコン

    fill(20);

    text("移動", 50, 375);
    text("拡大", 120, 375);
    text("縮小", 50, 455);
    text("振動", 120, 455);
    text("不動", 50, 535);


    //右のメニューバ-
    fill(220, 213, 200);

    rect(rmx, rmy, rmex - rmx, rmey - rmy);



    fill(31, 30, 99);
    text("錯視最適化", 1040, 95);

    textSize(10);
    text("DPI(ディスプレイ)", 1010, 125);
    text("エッジサイズ", 1105, 125);

    textSize(20);
    text(diff, 1130, 160);

    fill(31, 30, 99);
    text("選択範囲", 1055, 200);

    //右メニューで画像を出す
    if (rangedata.length > 0) {
      var ry = 220;
      for (e = rfn; e < rangedata.length; e++) {
        if (ry + rangeImage[e].height > height - 50) {
          break;
        }
        image(rangeImage[e], 1095 - rangeImage[e].width / 2, ry);
        //ellipseを右の画像に出す
        if (rangedata[e].mode == 1) {
          stroke(0, 255, 0);
          let ex = 1095;
          let ey = ry + rangeImage[e].height / 2;
          let eex = rangeImage[e].width;
          let eey = rangeImage[e].height;
          noFill();
          ellipse(ex, ey, eex, eey);
        }
        ry = ry + rangeImage[e].height + 20;
      }
    }

    //右メニューの画像を動かす矢印
    fill(31, 30, 99);
    triangle(1180, 300, 1170, 320, 1190, 320);
    triangle(1180, 540, 1170, 520, 1190, 520);
    stroke(30, 31, 99);
    fill(255);
    //画面上部
    //切り替え速度
    text("切替速度(fps):", 320, 45);
    //動画出力関係

    text("動画出力:", 590, 45);

    text("低画質", 690, 45);

    fill(111, 98, 178);
    rect(763, 15, 60, 40, 5);

    fill(255);
    text("GIF", 775, 45);

    fill(111, 98, 178);
    rect(840, 15, 80, 40, 5);

    fill(255);
    text("WebM", 850, 45);


    text("高画質", 940, 45);

    fill(111, 98, 178);
    rect(1013, 15, 60, 40, 5);

    fill(255);
    text("GIF", 1025, 45);

    fill(111, 98, 178);
    rect(1090, 15, 80, 40, 5);

    fill(255);
    text("WebM", 1100, 45);

    if (rangedata.length > 0) {
      //framemode(true)で全ての領域の画像の動きを合わせる

      //frame合わせ
      //frameRate(rangedata.get(a).speed*20);
      if (imgcount % 4 == 0) {
        image(img0, imgx, imgy);
      } else if (imgcount % 4 == 1) {
        image(img1, imgx, imgy);
      } else if (imgcount % 4 == 2) {
        image(img2, imgx, imgy);
      } else if (imgcount % 4 == 3) {
        image(img3, imgx, imgy);
      }
      if (imgcount < 3) {
        imgcount++;
      } else {
        imgcount = 0;
      }

      if (vis) {
        //既に選択している範囲を見えるようにする
        for (r = 0; r < rangedata.length; r++) {
          stroke(0, 255, 0);
          noFill();
          if (rangedata[r].mode == 0) {
            rect(rangedata[r].efX, rangedata[r].efY, rangedata[r].elX - rangedata[r].efX, rangedata[r].elY - rangedata[r].efY);
          } else if (rangedata[r].mode == 1) {
            ellipse(rangedata[r].efX, rangedata[r].efY, rangedata[r].elX, rangedata[r].elY);
          }
        }
      }
    } else {
      image(img, imgx, imgy);
    }
    rangesize = rangedata.length;

    strokeWeight(3);
    stroke(255, 0, 0);
    noFill();
    if (mode == 0) {
      rect(x, y, ax, ay);
    } else if (mode == 1) {
      ellipse(x, y, ax, ay);
    }
  }

}


function emboss(num, wi, he) {
  img.loadPixels();
  imgOriginal.loadPixels();
  pixel = [];
  Embpixel1 = [];
  Embpixel2 = [];
  Menu = [];

  if (wi == img.width && he == img.height) {

  } else {
    imgx = 0;
    imgy = 0;
  }

  //ピクセルを変更する範囲を求める
  for (j = 0; j < he - diff; j++) {
    for (i = 0; i < wi - diff; i++) {
      //println(i,j);
      //四角の場合
      if (rangedata[num].mode == 0) {

        if (rangedata[num].efX <= i + imgx && rangedata[num].elX >= i + imgx && rangedata[num].efY <= j + imgy && rangedata[num].elY >= j + imgy) {
          pixel.splice(i + (wi - diff) * j, 0, 1);

        } else {
          pixel.push(0);
        }
      }
      //円の場合   
      if (rangedata[num].mode == 1) {
        let aX, bX;

        aX = rangedata[num].elX;
        bX = rangedata[num].elY;

        if (sq(i + imgx - rangedata[num].efX) / sq((aX / 2)) + sq(j + imgy - rangedata[num].efY) / sq((bX / 2)) <= 1) {
          pixel.splice(i + (wi - diff) * j, 0, 1);
        } else {
          pixel.push(0);
        }
      }

    }
  }

  Menu.push(pixel);

  var centerX = 0, centerY = 0;
  if (rangedata[num].mode == 0) {
    centerX = (rangedata[num].efX + rangedata[num].elX) / 2;
    centerY = (rangedata[num].efY + rangedata[num].elY) / 2;
  } else if (rangedata[num].mode == 1) {
    centerX = rangedata[num].efX;
    centerY = rangedata[num].efY;
  }


  var gc, nc, f1, f2, f, s1, s2, s;

  //一方向
  if (rangedata[num].movemode == 0) {
    MangCalc(centerX, centerY);

    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        if (wi == img.width && he == img.height) {
          gc = img.get(i + gx, j + gy);
          nc = img.get(i + nx, j + ny);
        } else {
          gc = imgOriginal.get(i + gx, j + gy);
          nc = imgOriginal.get(i + nx, j + ny);
        }
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる
        f1 = brightness(gc);
        s1 = 255 - brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = 255 - brightness(nc);
        s2 = brightness(nc);
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        f = f1 + f2 - 128;
        s = s1 + s2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        Embpixel1.push(f);
        Embpixel2.push(s);
      }
    }
    //拡大
  } else if (rangedata[num].movemode == 1) {
    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        MangCalc(imgx + i, imgy + j);

        if (wi == img.width && he == img.height) {
          gc = img.get(i + gx, j + gy);
          nc = img.get(i + nx, j + ny);
        } else {
          gc = imgOriginal.get(i + gx, j + gy);
          nc = imgOriginal.get(i + nx, j + ny);
        }
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる
        f1 = 255 - brightness(gc);
        s1 = brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = brightness(nc);
        s2 = 255 - brightness(nc);
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        f = f1 + f2 - 128;
        s = s1 + s2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        Embpixel1.push(f);
        Embpixel2.push(s);
      }
    }
    //縮小
  } else if (rangedata[num].movemode == 2) {
    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        MangCalc(imgx + i, imgy + j);
        if (wi == img.width && he == img.height) {
          gc = img.get(i + gx, j + gy);
          nc = img.get(i + nx, j + ny);
        } else {
          gc = imgOriginal.get(i + gx, j + gy);
          nc = imgOriginal.get(i + nx, j + ny);
        }
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる
        f1 = brightness(gc);
        s1 = 255 - brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = 255 - brightness(nc);
        s2 = brightness(nc);
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        f = f1 + f2 - 128;
        s = s1 + s2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        Embpixel1.push(f);
        Embpixel2.push(s);

      }
    }
  }//振動
  else if (rangedata[num].movemode == 3) {
    MangCalc(centerX, centerY);
    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        if (wi == img.width && he == img.height) {
          gc = img.get(i + gx, j + gy);
          nc = img.get(i + nx, j + ny);
        } else {
          gc = imgOriginal.get(i + gx, j + gy);
          nc = imgOriginal.get(i + nx, j + ny);
        }
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる
        f1 = brightness(gc);
        s1 = 255 - brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = 255 - brightness(nc);
        s2 = brightness(nc);
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        f = f1 + f2 - 128;
        s = f1 + f2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        Embpixel1.push(f);
        Embpixel2.push(s);
      }
    }
    //運動なし（グレースケール）
  } else if (rangedata[num].movemode == 4) {

    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {

        if (wi == img.width && he == img.height) {
          gc = img.get(i, j);
          nc = img.get(i, j);
        } else {
          gc = imgOriginal.get(i, j);
          nc = imgOriginal.get(i, j);
        }
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる
        f1 = brightness(gc);
        s1 = 255 - brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = 255 - brightness(nc);
        s2 = brightness(nc);
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        f = f1 + f2 - 128;
        s = f1 + f2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        Embpixel1.push(f);
        Embpixel2.push(s);
      }
    }
  }


  Menu.push(Embpixel1);
  Menu.push(Embpixel2);

  PixelData.splice(num, 0, Menu);

  syorityu = false;

  function MangCalc(_centerx, _centery) {
    //クリックした位置の方向に運動させるために必要な画像の角度を求める
    Mang = degrees(atan2(rangedata[num].mousey - _centery, rangedata[num].mousex - _centerx));
    if (Mang > 180) {
      Mang = Mang - 360;
    }
    if (Mang <= 0 && Mang >= -90) {
      gx = 0;
      gy = abs(round(sin(radians(Mang)) * diff));
      nx = abs(round(cos(radians(Mang)) * diff));
      ny = 0;
    } else if (Mang <= -90 && Mang >= -180) {
      gx = abs(round(cos(radians(Mang)) * diff));
      gy = abs(round(sin(radians(Mang)) * diff));
      nx = 0;
      ny = 0;
    } else if (Mang >= 0 && Mang <= 90) {
      gx = 0;
      gy = 0;
      nx = abs(round(cos(radians(Mang)) * diff));
      ny = abs(round(sin(radians(Mang)) * diff));
    } else if (Mang >= 90 && Mang <= 180) {
      gx = abs(round(cos(radians(Mang)) * diff));
      gy = 0;
      nx = 0;
      ny = abs(round(sin(radians(Mang)) * diff));
    }
  }
}


// ドラッグ開始
function mousePressed() {
  var moveJug = false;//一度でも範囲に入ったかどうか
  var moveJugNum = -1;//入ったNoを書いておいて一番上層のNoを最後参照して動かす
  if (mouseButton == LEFT) {
    if (mouseX >= imgx && mouseX <= imgEx && mouseY >= imgy && mouseY <= imgEy) {

      var partclick = false;
      for (k = rangedata.length - 1; k >= 0; k--) {

        //既に指定された部分の動き方向を変える場合

        //四角の場合

        if (rangedata[k].mode == 0) {
          if (mouseX > rangedata[k].efX && mouseX < rangedata[k].elX && mouseY > rangedata[k].efY && mouseY < rangedata[k].elY && !(rangedata[k].efX == imgx && rangedata[k].elX == imgEx && rangedata[k].efY == imgy && rangedata[k].elY == imgEy) && moveJug == false) {
            moveJug = true;
            efx = rangedata[k].efX;
            efy = rangedata[k].efY;
            elx = rangedata[k].elX;
            ely = rangedata[k].elY;
            Speed(efx, efy, elx, ely, rangedata[k].mode);
            rangedata.splice(k, 1, new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, 0, 0, Movemode));
            PixelData.splice(k, 1);
            emboss(k, img.width, img.height);
            partclick = true;
          }

        } else if (rangedata[k].mode == 1) {  //円の場合 
          var a, b;
          if (rangedata[k].elX >= rangedata[k].elY) {
            a = rangedata[k].elX;
            b = rangedata[k].elY;
          } else {
            b = rangedata[k].elX;
            a = rangedata[k].elY;
          }

          if (sq(mouseX - rangedata[k].efX) / sq((a / 2)) + sq(mouseY - rangedata[k].efY) / sq((b / 2)) <= 1 && moveJug == false) {
            moveJug = true;
            efx = rangedata[k].efX;
            efy = rangedata[k].efY;
            elx = rangedata[k].elX;
            ely = rangedata[k].elY;
            Speed(efx, efy, elx, ely, rangedata[k].mode);
            rangedata.splice(k, 1, new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, 1, 0, Movemode));
            PixelData.splice(k, 1);

            emboss(k, img.width, img.height);
            partclick = true;
          }
        }


      }

      //全画面選択
      if (!partclick) {
        efx = imgx;
        efy = imgy;
        elx = imgEx;
        ely = imgEy;

        speed = Speed(efx, efy, elx, ely, 0);

        rangedata.splice(0, 0, new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, 0, 0, Movemode));


        if (allpart && rangedata.length >= 2) {
          rangedata.splice(1, 1);
        }
        if (allpart && PixelData.length >= 1) {
          PixelData.length = 0;
        }


        allpart = true;//一度でも全画面選択が使用されたか

        for (k = 0; k < rangedata.length; k++) {
          emboss(k, img.width, img.height);
        }
        rangeImage[rangedata.length - 1] = createImage(elx - efx, ely - efy);
        rangeImage[rangedata.length - 1] = img.get(efx - imgx, efy - imgy, elx - efx, ely - efy);

        if (rangeImage[rangedata.length - 1].width > 150) {
          rangeImage[rangedata.length - 1].resize(150, 0);
        }
      }

      framemodespeed = int(speed);
      imageGeneration(img.width, img.height);
    }

    //右メニューバーからエンボスさせる
    let rry = 220;
    for (e = rfn; e < rangedata.length; e++) {
      if (rangedata[e].mode == 0) {

        if ((mouseX > 1095 - rangeImage[e].width / 2 && mouseX < 1095 + rangeImage[e].width / 2 && rry < mouseY && mouseY < rry + rangeImage[e].height)) {

          efx = rangedata[e].efX;
          efy = rangedata[e].efY;
          elx = rangedata[e].elX;
          ely = rangedata[e].elY;
          Speed(efx, efy, elx, ely, rangedata[e].mode);

          //右メニューでの画像と本画像のクリック位置を合わせる
          console.log(mouseX, 1095 - rangeImage[e].width / 2, 1095 + rangeImage[e].width / 2, rangedata[e].efX, rangedata[e].elX);
          console.log(mouseY, rry, rry + rangeImage[e].height, imgy, imgEy);
          let mousexr = map(mouseX, 1095 - rangeImage[e].width / 2, 1095 + rangeImage[e].width / 2, rangedata[e].efX, rangedata[e].elX);
          let mouseyr = map(mouseY, rry, rry + rangeImage[e].height, rangedata[e].efY, rangedata[e].elY);

          rangedata.splice(e, 1, new RangeData(efx, efy, elx, ely, mousexr, mouseyr, speed, 0, 0, Movemode));
          PixelData.splice(e, 1);
          emboss(e, img.width, img.height);
          partclick = true;
          imageGeneration(img.width, img.height);
        }

      } else if (rangedata[e].mode == 1) {  //円の場合 
        var a, b;
        if (rangedata[e].elX >= rangedata[e].elY) {
          a = rangedata[e].elX;
          b = rangedata[e].elY;
        } else {
          b = rangedata[e].elX;
          a = rangedata[e].elY;
        }

        if ((mouseX > 1095 - rangeImage[e].width / 2 && mouseX < 1095 + rangeImage[e].width / 2 && rry < mouseY && mouseY < rry + rangeImage[e].height)) {
          moveJug = true;
          efx = rangedata[e].efX;
          efy = rangedata[e].efY;
          elx = rangedata[e].elX;
          ely = rangedata[e].elY;
          Speed(efx, efy, elx, ely, rangedata[e].mode);
          let mousexr = map(mouseX, 1095 - rangeImage[e].width / 2, 1095 + rangeImage[e].width / 2, imgx, imgEx);
          let mouseyr = map(mouseY, rry, rry + rangeImage[e].height, imgy, imgEy);
          rangedata.splice(e, 1, new RangeData(efx, efy, elx, ely, mousexr, mouseyr, speed, 1, 0, Movemode));
          PixelData.splice(e, 1);

          emboss(e, img.width, img.height);
          partclick = true;
          imageGeneration(img.width, img.height);

        }
      }
      rry = rry + rangeImage[e].height + 20;
      framemodespeed = int(speed);

    }
    //右メニューの画像の表示切り替え
    if (mouseX > 1170 && mouseX < 1190 && mouseY > 300 && mouseY < 320 && rfn > 0) {
      rfn--;

    } else if (mouseX > 1170 && mouseX < 1190 && mouseY > 520 && mouseY < 540 && rfn < rangedata.length - 1) {
      rfn++;
    }

  }




  //指定ドラッグスタート座標
  if (mouseX >= 200 && mouseX <= 1190 && mouseY >= 60 && mouseY <= 930) {


    if (mouseButton == RIGHT) {
      Efx = mouseX;
      Efy = mouseY;

      if (mode == 0 || mode == 1) {
        x = Efx;
        y = Efy;
      }
    }
  }

  //メニューバー
  if (mouseButton == LEFT) {
    //領域選択
    if (mouseX > 40 && mouseX < 170 && mouseY > 120 && mouseY < 180) {
      mode = 0;
    } else if (mouseX > 40 && mouseX < 170 && mouseY > 195 && mouseY < 255) {
      mode = 1;
    }
    noStroke();
    if (Movemode == 0) {
      fill(99, 98, 30);
      rect(30, 340, 75, 60);
    } else if (Movemode == 1) {
      fill(99, 98, 30);
      rect(105, 340, 75, 60);
    } else if (Movemode == 2) {
      fill(99, 98, 30);
      rect(30, 420, 75, 60);
    } else if (Movemode == 3) {
      fill(99, 98, 30);
      rect(105, 420, 75, 60);
    }

    //運動方法
    if (mouseX > 30 && mouseX < 105 && mouseY > 340 && mouseY < 400) {
      Movemode = 0;
    } else if (mouseX > 105 && mouseX < 180 && mouseY > 340 && mouseY < 400) {
      Movemode = 1;
    } else if (mouseX > 30 && mouseX < 105 && mouseY > 420 && mouseY < 480) {
      Movemode = 2;
    } else if (mouseX > 105 && mouseX < 180 && mouseY > 420 && mouseY < 480) {
      Movemode = 3;
    } else if (mouseX > 30 && mouseX < 105 && mouseY > 500 && mouseY < 560) {
      Movemode = 4;
    }


    //領域削除
    if (mouseX > 70 && mouseX < 140 && mouseY > 640 && mouseY < 710) {
      for (i = 0; i < rangedata.length; i++) {
        if (efx == rangedata[i].efX) {
          if (rangedata[i].efX == imgx && rangedata[i].elX == imgEx && rangedata[i].efY == imgy && rangedata[i].elY == imgEy) {
            allpart = false;
          }
          rangedata.splice(i, 1);
          rangeImage.splice(i, 1);

        }
      }

      for (k = 0; k < rangedata.length; k++) {
        emboss(k, img.width, img.height);
      }
      imageGeneration(img.width, img.height);
    }

    //動画出力
    //GIF　rect(1013, 15, 60, 40, 5);  
    if (rangedata.length > 0) {

      if (mouseX > 763 && mouseX < 823 && mouseY > 0 && mouseY < 60 && po == 0) {
        hozonWidth = img.width;
        hozonHeight = img.height;
        Format = 'gif'
        Export(img.width, img.height, 0);
        //gif = true;


      }

      //WEBM rect(1090, 15, 80, 40, 5);
      if (mouseX > 840 && mouseX < 920 && mouseY > 0 && mouseY < 60 && po == 0) {
        hozonWidth = img.width;
        hozonHeight = img.height;
        Format = 'webm';
        Export(img.width, img.height, 0);

      }

      if (mouseX > 1013 && mouseX < 1073 && mouseY > 0 && mouseY < 60 && po == 0) {
        hozonWidth = originalWidth;
        hozonHeight = originalheight;
        Format = 'gif';
        Export(originalWidth, originalheight, 0);

        //gif = true;
      }

      //WEBM rect(1090, 15, 80, 40, 5);
      if (mouseX > 1090 && mouseX < 1170 && mouseY > 0 && mouseY < 60 && po == 0) {
        hozonWidth = originalWidth;
        hozonHeight = originalheight;
        Format = 'webm';
        Export(originalWidth, originalheight, 0);
      }
    }

  }
}




// ドラッグ中にマウスの場所が四角の終点になる
function mouseDragged() {
  if (mouseButton == RIGHT) {
    if (mouseX >= 200 && mouseX <= 1190 && mouseY >= 60 && mouseY <= 930) {

      if (mode == 0) {
        ax = mouseX - x;
        ay = mouseY - y;
      } else if (mode == 1) {
        x = (mouseX + Efx) / 2;
        y = (mouseY + Efy) / 2;
        ax = mouseX - Efx;
        ay = mouseY - Efy;
        if ((keyPressed == true) && (keyCode == CONTROL)) {
          var a = dist(x, y, mouseX, mouseY);
          ax = int(a * 2);
          ay = int(a * 2);
        }
      }
    }
  }
}

// ドラッグ終了時に四角が消えて指定した部分が動く
function mouseReleased() {
  if (mouseButton == RIGHT) {
    if (mouseX >= 200 && mouseX <= 1190 && mouseY >= 60 && mouseY <= 930
    ) {
      efx = Efx;
      efy = Efy;
      //画像内で領域選択がされているか判定
      var exCenter = (mouseX + Efx) / 2;
      var eyCenter = (mouseY + Efy) / 2;
      var imxCenter = (imgx + imgEx) / 2;
      var imyCenter = (imgy + imgEy) / 2;
      var xCenDist = abs(exCenter - imxCenter);
      var yCenDist = abs(eyCenter - imyCenter);
      var xsizeSum = (abs(mouseX - Efx) + abs(imgEx - imgx)) / 2;
      var ysizeSum = (abs(mouseY - Efy) + abs(imgEy - imgy)) / 2;
      console.log(exCenter, eyCenter, imxCenter, imyCenter, xCenDist, xsizeSum, yCenDist, ysizeSum);
      if (xCenDist < xsizeSum && yCenDist < ysizeSum) {


        //選択範囲がウィンドウを越えた場合
        if (mode == 0) {
          if (mouseX >= imgEx) {
            elx = imgEx;
          } else {
            elx = mouseX;
          }

          if (efx <= imgx) {
            efx = imgx;
          }
          if (efy <= imgy) {
            efy = imgy;
          }

          if (mouseY >= imgEy) {
            ely = imgEy;
          } else {
            ely = mouseY;
          }
          //逆位置からドラックした場合
          if (efx >= elx) {
            var a = elx;
            elx = efx;
            efx = a;
          }
          if (efy >= ely) {
            var a = ely;
            ely = efy;
            efy = a;
          }

        } else if (mode == 1) {
          efx = x;
          efy = y;
          elx = ax;
          ely = ay;
        }


        speed = 3;

        rangedata.push(new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, mode, 0, Movemode));

        emboss(rangedata.length - 1, img.width, img.height);


        //右メニューに出す画像データを取得する
        if (mode == 0) {
          rangeImage[rangedata.length - 1] = createImage(elx - efx, ely - efy);
          rangeImage[rangedata.length - 1] = img.get(efx - imgx, efy - imgy, elx - efx, ely - efy);

          if (rangeImage[rangedata.length - 1].width > 150) {
            rangeImage[rangedata.length - 1].resize(150, 0);
          }
        } else if (mode == 1) {
          rangeImage[rangedata.length - 1] = createImage(elx, ely);
          rangeImage[rangedata.length - 1] = img.get(efx - elx / 2 - imgx, efy - ely / 2 - imgy, elx, ely);

          if (rangeImage[rangedata.length - 1].width > 150) {
            rangeImage[rangedata.length - 1].resize(150, 0);
          }
        }


        imageGeneration(img.width, img.height);
      }
      x = -10;
      y = -10;
      ax = -10;
      ay = -10;
    }

  }
}

function keyPressed() {
  if (key == "s") {
    if (vis) {
      vis = false;
    } else {
      vis = true;
    }
  }

}

function imageGeneration(wi, he) {


  if (hozon) {
    if (ExportStep == rangedata.length + 2) {
      syorityu = true;
      img0.loadPixels();
      img1.loadPixels();
      img2.loadPixels();
      img3.loadPixels();

      for (j = 0; j < he - diff; j++) {
        for (i = 0; i < wi - diff; i++) {
          let c;
          if (wi == img.width && he == img.height) {
            c = img.get(i, j);
          } else {
            c = imgOriginal.get(i, j);
          }
          img0.set(i, j, c);
          img1.set(i, j, c);
          img2.set(i, j, c);
          img3.set(i, j, c);
        }
      }
    } else if (ExportStep >= rangedata.length + 3 && ExportStep < rangedata.length + 3 + rangedata.length) {
      a = ExportStep - (rangedata.length + 3)
      for (j = 0; j < he - diff; j++) {
        for (i = 0; i < wi - diff; i++) {
          let c;
          if (PixelData[a][0][i + (wi - diff) * j] == 1) {
            if (wi == img.width && he == img.height) {
              c = img.get(i, j);
            } else {
              c = imgOriginal.get(i, j);
            }
            img0.set(i, j, c);
            img1.set(i, j, color(PixelData[a][1][i + (wi - diff) * j]));
            img2.set(i, j, color(255 -
              red(c), 255 - blue(c), 255 - green(c)));
            img3.set(i, j, color(PixelData[a][2][i + (wi - diff) * j]));
          }
        }
      }
    }
    else if (ExportStep == rangedata.length + 3 + rangedata.length) {
      img0.updatePixels();
      img1.updatePixels();
      img2.updatePixels();
      img3.updatePixels();

      syorityu = false;
    }

  } else {

    syorityu = true;
    img0.loadPixels();
    img1.loadPixels();
    img2.loadPixels();
    img3.loadPixels();

    //何故かずれるので１マスずらしてる
    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        let c;
        if (wi == img.width && he == img.height) {
          c = img.get(i, j);
        } else {
          c = imgOriginal.get(i, j);
        }
        img0.set(i, j, c);
        img1.set(i, j, c);
        img2.set(i, j, c);
        img3.set(i, j, c);
      }
    }


    for (a = 0; a < rangedata.length; a++) {

      for (j = 0; j < he - diff; j++) {
        for (i = 0; i < wi - diff; i++) {
          let c;
          if (PixelData[a][0][i + (wi - diff) * j] == 1) {
            if (wi == img.width && he == img.height) {
              c = img.get(i, j);
            } else {
              c = imgOriginal.get(i, j);
            }
            img0.set(i, j, c);
            img1.set(i, j, color(PixelData[a][1][i + (wi - diff) * j]));
            img2.set(i, j, color(255 -
              red(c), 255 - blue(c), 255 - green(c)));
            img3.set(i, j, color(PixelData[a][2][i + (wi - diff) * j]));
          }
        }
      }



    }
    img0.updatePixels();
    img1.updatePixels();
    img2.updatePixels();
    img3.updatePixels();

    syorityu = false;
  }
}

function imageReset(imG) {
  imG.resize(400, 0);
  if (imG.width >= 400) {
    imG.resize(400, 0);
  } else if (imG.height >= 300) {
    imG.resize(0, 300);
  }
  img0 = createImage(img.width, img.height);
  img1 = createImage(img.width, img.height);
  img2 = createImage(img.width, img.height);
  img3 = createImage(img.width, img.height);
  //画像の座標
  //始点
  imgx = width / 2 - imG.width / 2;
  imgy = 430 - imG.height / 2;
  //終点
  imgEx = imgx + imG.width;
  imgEy = imgy + imG.height;

  rangedata.length = 0;
  PixelData.length = 0;
}

function Export(wid, hei, exportStep) {
  if (exportStep == 0) {
    diff = Math.round(1.12 / (25.4 / Number(document.getElementById("DPI").value)));
    mp4 = true;
    allsteps = rangedata.length + 3 + rangedata.length + 1;

    if (Format == "webm") {
      capturer = new CCapture({
        format: Format,
        framerate: framerate,
        verbose: true,
        name: 01,
        timeLimit: 20
      });
      saveFrame = 92;
    } else {
      console.log("gif");
      capturer = new CCapture({
        format: Format,
        framerate: framerate,
        name: 01,
        workersPath: './js/',
        verbose: true
      });
      saveFrame = 3;
    }
    input.hide();
    document.getElementById("number2").style.display = "none";
    document.getElementById("Twitter").style.display = "block";

    var sketch1 = function (p) {

      p.setup = function () {
        p.createCanvas(1200, 800);

      };

      p.draw = function () {
        p.fill(255);
        p.textSize(50);
        p.background(70);
        p.rect(400, 375, 400, 50);
        p.fill(0, 255, 0);
        var mapStep = map(ExportStep, 0, allsteps, 0, 400);
        p.rect(400, 375, mapStep, 50);
        p.fill(255);
        p.text("出力中", 480, 300);
        p.text("(" + ExportStep + "/" + allsteps + ")", 640, 300);
      };


    };
    new p5(sketch1, "container1");

    hozon = true;
    p5Canvas = createCanvas(wid - diff, hei - diff);
    p5Canvas.hide();

    img0 = createImage(wid, hei);
    img1 = createImage(wid, hei);
    img2 = createImage(wid, hei);
    img3 = createImage(wid, hei);

    ExportStep++;
  } else if (2 <= exportStep && exportStep < rangedata.length + 2) {
    //rangedataを元の画像サイズ版にする
    if (wid != img.width) {
      i = ExportStep - 2;
      rangedata[i].efX = map(rangedata[i].efX, imgx, imgEx, 0, wid);
      rangedata[i].efY = map(rangedata[i].efY, imgy, imgEy, 0, hei);
      rangedata[i].elX = map(rangedata[i].elX, imgx, imgEx, 0, wid);
      rangedata[i].elY = map(rangedata[i].elY, imgy, imgEy, 0, hei);
      emboss(i, wid, hei);
    }

  } else if (exportStep >= rangedata.length + 2 && exportStep <= rangedata.length + 3 + rangedata.length) {
    imageGeneration(wid, hei);


    //save(img0, "1.png");
    //save(img1, "2.png");
    //save(img2, "3.png");
    //save(img3, "4.png");

    imgcount = 0;
  }

  console.log(ExportStep);

}

//speedを求める関数
function Speed(efx, efy, elx, ely, mode) {
  var centerX = 0, centerY = 0;
  let speed;
  if (mode == 0) {
    centerX = (efx + elx) / 2;
    centerY = (efy + ely) / 2;
    speed = int(sqrt(sq(abs(mouseY - centerY)) + sq(abs(mouseX - centerX))));
    // speed=map(speed, 0, sqrt(sq(abs(ely-centerY))+sq(abs(elx-centerX))), 1, 5);

    if (elx - centerX > ely - centerY) {
      speed = map(speed, 0, abs(elx - centerX), 0, 5);
    } else {
      speed = map(speed, 0, abs(ely - centerY), 0, 5);
    }
  } else if (mode == 1) {
    centerX = efx;
    centerY = efy;
    speed = int(sqrt(sq(abs(mouseY - centerY)) + sq(abs(mouseX - centerX))));
    speed = map(speed, 0, sqrt(sq(abs(ely / 2 - centerY)) + sq(abs(elx / 2 - centerX))), 0, 5);
  }

  //クリックした位置の方向に運動させるために必要な画像の角度を求める
  speed = int(fm - speed);

  if (speed < 1) {
    speed = 1;
  }
  return speed;
}

class RangeData {//どこが選択されたかを表す（始点X，始点Y，終点X,終点Y,選択部分ののどこが押されたか（運動方向）X,Y）

  constructor(efX, efY, elX, elY, mousex, mousey, speed, mode, RassoPixelNum, movemode) {
    this.efX = efX;
    this.efY = efY;
    this.elX = elX;
    this.elY = elY;
    this.mousex = mousex; //動く方向
    this.mousey = mousey;
    this.mode = mode;
    this.speed = speed;
    this.RassoPixelNum = RassoPixelNum;
    this.movemode = movemode;
  }
}