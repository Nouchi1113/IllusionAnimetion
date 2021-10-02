var imgcount = 0;
var rangedata = [];

var PixelData = [];

var img0, img1, img2, img3, img, Kotei, Jiyu, Sakujo;

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

var diff = 3;//どれぐらいずらすか
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



var po = 0;

var input;

var syorityu = false;

function preload() {
  //変数を使って画像をロード
  img = loadImage("bike.jpg");
  Kotei = loadImage("Kotei.png");
  Jiyu = loadImage("Jiyu.png");
  Sakujo = loadImage("Sakujo.png");
}

function setup() {


  frameRate(framerate);
  createCanvas(1200, 800);
  textFont("Meiryo", 50);

  Kotei.resize(105, 50);

  Jiyu.resize(105, 50);

  Sakujo.resize(70, 70);

  imageReset(img);






  savepixel = [];//Moveangle,一つ目の画像の角度，２つ目

  input = createFileInput(handleFile);
  input.position(30, 30);
}

function imageLoaded() { //★２
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
    imageReset(img);
  } else {
    img = null;
  }
}



function draw() {
  background(70);
  //background(68, 114, 196);

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

  /**/
  stroke(105);
  textSize(20);
  fill(31, 30, 99);
  text("領域選択", 65, 95);
  fill(237, 234, 227);
  noStroke();
  rect(20, 105, 170, 170, 5);//領域選択のアイコン背景


  fill(31, 30, 99);
  text("運動速度", 65, 315);
  fill(237, 234, 227);

  rect(20, 325, 170, 85, 5);//運動速度のアイコン選択

  fill(31, 30, 99);
  text("領域削除", 65, 535);


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
  /**/
  if (framemode) {
    fill(99, 98, 30);
    rect(40, 340, 130, 60);
  }
  /*
    if (!framemode) {
      fill(99, 98, 30);
      rect(40, 420, 130, 60);
    }
  */
  //メニューバーのアイコン
  fill(20);
  rect(60, 130, 90, 40);//四角アイコン
  ellipse(105, 225, 50, 50);//丸アイコン


  image(Sakujo, 70, 540);

  fill(20);
  image(Kotei, 55, 345);

  //image(Jiyu, 55, 425);
  /*
  fill(255);
  textSize(25);
  text("動画保存", 1055, 45);
  triangle(1160, 30, 1170, 30, 1165, 40);
*/


  image(img, imgx, imgy);


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
  } else if (mode == 2) {

  }


}


function emboss(num) {
  img.loadPixels();
  pixel = [];
  Embpixel1 = [];
  Embpixel2 = [];
  Menu = [];

  //ピクセルを変更する範囲を求める
  for (j = 0; j < img.height - diff; j++) {
    for (i = 0; i < img.width - diff; i++) {
      //println(i,j);
      //四角の場合
      if (rangedata[num].mode == 0) {

        if (rangedata[num].efX < i + imgx && rangedata[num].elX > i + imgx && rangedata[num].efY < j + imgy && rangedata[num].elY > j + imgy) {
          pixel.splice(i + (img.width - diff) * j, 0, 1);

        } else {
          pixel.push(0);
        }
      }
      //円の場合   
      if (rangedata[num].mode == 1) {
        let aX, bX;
        if (rangedata[num].elX >= rangedata[num].elY) {
          aX = rangedata[num].elX;
          bX = rangedata[num].elY;
        } else {
          bX = rangedata[num].elX;
          aX = rangedata[num].elY;
        }

        if (sq(i + imgx - rangedata[num].efX) / sq((aX / 2)) + sq(j + imgy - rangedata[num].efY) / sq((bX / 2)) <= 1) {
          pixel.splice(i + (img.width - diff) * j, 0, 1);
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
  //クリックした位置の方向に運動させるために必要な画像の角度を求める

  Mang = degrees(atan2(rangedata[num].mousey - centerY, rangedata[num].mousex - centerX));

  ang[0] = Mang;
  if (ang[0] > 180) {
    ang[0] = ang[0] - 360;
  }
  ang[1] = Mang + 180;
  if (ang[1] > 180) {
    ang[1] = ang[1] - 360;
  }

  for (a = 0; a < 2; a++) {//エンボス画像の１番目か二番目か


    if (ang[a] <= 0 && ang[a] >= -90) {
      gx = 0;
      gy = abs(round(sin(radians(ang[a])) * diff));
      nx = abs(round(cos(radians(ang[a])) * diff));
      ny = 0;
    } else if (ang[a] <= -90 && ang[a] >= -180) {
      gx = abs(round(cos(radians(ang[a])) * diff));
      gy = abs(round(sin(radians(ang[a])) * diff));
      nx = 0;
      ny = 0;
    } else if (ang[a] >= 0 && ang[a] <= 90) {
      gx = 0;
      gy = 0;
      nx = abs(round(cos(radians(ang[a])) * diff));
      ny = abs(round(sin(radians(ang[a])) * diff));
    } else if (ang[a] >= 90 && ang[a] <= 180) {
      gx = abs(round(cos(radians(ang[a])) * diff));
      gy = 0;
      nx = 0;
      ny = abs(round(sin(radians(ang[a])) * diff));
    }
    console.log("a");

    var gc, nc, f1, f2, f;
    for (j = 0; j < img.height - diff; j++) {
      for (i = 0; i < img.width - diff; i++) {

        gc = img.get(i + gx, j + gy);
        nc = img.get(i + nx, j + ny);
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる

        f1 = brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = 255 - brightness(nc);

        f = f1 + f2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        if (a == 0) {
          Embpixel1.push(f);
        } else {
          Embpixel2.push(f);
        }
      }
    }

    if (a == 0) {
      Menu.push(Embpixel1);
    } else {
      Menu.push(Embpixel2);
    }
  }
  PixelData.splice(num, 0, Menu);
  syorityu = false;
}


// ドラッグ開始
function mousePressed() {

  var moveJug = false;//一度でも範囲に入ったかどうか
  var moveJugNum = -1;//入ったNoを書いておいて一番上層のNoを最後参照して動かす
  if (mouseX >= imgx && mouseX <= imgEx && mouseY >= imgy && mouseY <= imgEy) {
    if (mouseButton == LEFT) {
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
            rangedata.splice(k, 1, new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, 0, 0));
            PixelData.splice(k, 1);
            emboss(k);
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
            rangedata.splice(k, 1, new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, 1, 0));
            PixelData.splice(k, 1);

            emboss(k);
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

        rangedata.splice(0, 0, new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, 0, 0));

        if (allpart && rangedata.length >= 2) {
          rangedata.splice(1, 1);
        }
        if (allpart && PixelData.length >= 1) {
          PixelData.length = 0;
        }


        allpart = true;//一度でも全画面選択が使用されたか

        for (k = 0; k < rangedata.length; k++) {
          emboss(k);

        }
      }

      framemodespeed = int(speed);
      imageGeneration();
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
    }
    if (mouseX > 40 && mouseX < 170 && mouseY > 195 && mouseY < 255) {
      mode = 1;
    }
    //運動中止
    if (mouseX > 70 && mouseX < 140 && mouseY > 540 && mouseY < 610) {
      for (i = 0; i < rangedata.length; i++) {

        if (efx == rangedata[i].efX) {
          if (rangedata[i].efX == imgx && rangedata[i].elX == imgEx && rangedata[i].efY == imgy && rangedata[i].elY == imgEy) {
            allpart = false;

          }

          rangedata.splice(i, 1);

        }

      }

      for (k = 0; k < rangedata.length; k++) {
        emboss(k);
      }
      imageGeneration()

    }
    /*運動速度

    if (mouseX > 40 && mouseX < 170 && mouseY > 340 && mouseY < 400) {
      framemode = true;
    }
    if (mouseX > 40 && mouseX < 170 && mouseY > 420 && mouseY < 480) {
      framemode = false;
    }
   

    //動画保存　rect(970, 20, 180, 60)
    if (mouseX > 1055 && mouseX < 1200 && mouseY > 0 && mouseY < 60 && po == 0) {
      Gifrecord = true;
      Gifcount = 0;
      po++;
    }
     */
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
        ax = (mouseX - x) * 2;
        ay = (mouseY - y) * 2;
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
    if (mouseX >= 200 && mouseX <= 1190 && mouseY >= 60 && mouseY <= 930) {
      efx = Efx;
      efy = Efy;

      //選択範囲がウィンドウを越えた場合
      if (mode == 0) {
        if (mouseX >= imgEx) {
          elx = imgEx;
        } else {
          elx = mouseX;
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
        elx = ax;
        ely = ay;
      }

      //mode2と被っているので一時的なコードにしてる
      if (mode != 2) {
        speed = 3;

        rangedata.push(new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, mode, 0));

        emboss(rangedata.length - 1);

        x = -10;
        y = -10;
        ax = -10;
        ay = -10;
      }

    }
    imageGeneration();
  }
}

function keyPressed() {
  /*
  if (key == 'f') {
    if (framemode) {
      framemode = false;
    } else {
      framemode = true;
    }
  }
  if (key == 'r') {
    if (mode != 0) {
      mode = 0;
    }
  }
  if (key == 'e') {
    if (mode != 1) {
      mode = 1;
    }
  }

  //指定位置の削除
  if (key == 'd') {
    for (i = 0; i < rangedata.length; i++) {
      if (efx == rangedata[i].efX) {
        if (rangedata[i].efX == 0 && rangedata[i].elX == imgEx && rangedata[i].elX == 0 && rangedata[i].elY == imgEy) {
          allpart = false;

        }
        console.log(i, rangedata.length, rangedata[i]);
        rangedata.splice(i, 1);
        console.log(i, rangedata.length, rangedata[i]);
      }
    }
    for (i = 0; i < rangedata.length; i++) {
      emboss(i);
    }
  }


  if (key == ' ') {
    Gifrecord = true;

    Gifcount = 0;
  }
  */
}

function imageGeneration() {
  syorityu = true;


  img0.loadPixels();
  img1.loadPixels();
  img2.loadPixels();
  img3.loadPixels();
  for (j = 0; j < img.height - diff; j++) {
    for (i = 0; i < img.width - diff; i++) {

      let c = img.get(i, j);
      img0.set(i, j, c);
      img1.set(i, j, c);
      img2.set(i, j, c);
      img3.set(i, j, c);

    }
  }


  for (a = 0; a < rangedata.length; a++) {

    for (j = 0; j < img.height - diff; j++) {
      for (i = 0; i < img.width - diff; i++) {
        if (PixelData[a][0][i + (img.width - diff) * j] == 1) {
          let c = img.get(i, j);
          img0.set(i, j, c);
        }
      }
    }


    for (j = 0; j < img.height - diff; j++) {
      for (i = 0; i < img.width - diff; i++) {

        if (PixelData[a][0][i + (img.width - diff) * j] == 1) {
          img1.set(i, j, color(PixelData[a][1][i + (img.width - diff) * j]));
        }
      }
    }


    for (j = 0; j < img.height - diff; j++) {
      for (i = 0; i < img.width - diff; i++) {

        if (PixelData[a][0][i + (img.width - diff) * j] == 1) {
          let c = img.get(i, j);
          img2.set(i, j, color(255 -
            red(c), 255 - blue(c), 255 - green(c)));
        }
      }
    }


    for (j = 0; j < img.height - diff; j++) {
      for (i = 0; i < img.width - diff; i++) {
        if (PixelData[a][0][i + (img.width - diff) * j] == 1) {
          img3.set(i, j, color(PixelData[a][2][i + (img.width - diff) * j]));
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
  imgx = 700 - imG.width / 2;
  imgy = 430 - imG.height / 2;
  //終点
  imgEx = imgx + imG.width;
  imgEy = imgy + imG.height;


  rangedata.length = 0;
  PixelData.length = 0;
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

  constructor(efX, efY, elX, elY, mousex, mousey, speed, mode, RassoPixelNum) {
    this.efX = efX;
    this.efY = efY;
    this.elX = elX;
    this.elY = elY;
    this.mousex = mousex; //動く方向
    this.mousey = mousey;
    this.mode = mode;
    this.speed = speed;
    this.RassoPixelNum = RassoPixelNum;
  }
}