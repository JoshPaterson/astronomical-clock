const tau = 2 * Math.PI;
var latitudeDeg = 44.26222;
var longitudeDeg = -88.407287;
var latitudeRad = latitudeDeg / 360 * tau;
var longitudeRad = longitudeDeg / 360 * tau;
var elevation = 232;
var observer = Astronomy.MakeObserver(latitudeDeg, longitudeDeg, elevation)

function sectorPath(LHA_set_rad) {
    var x = Math.sin(LHA_set_rad) * 49;
    var y = -49 - Math.cos(LHA_set_rad) * 49;
    return `M 50 50 v 49 a 49 49 90 0 0 ${x} ${y} Z v 49 a 49 49 90 0 1 -${x} ${y} Z`
};

function LHA(alt, dec, obs_lat) {
    return Math.acos((Math.sin(alt) - Math.sin(obs_lat)*Math.sin(dec))/(Math.cos(obs_lat)*Math.cos(dec)))
}

function drawFaceRegions() {
    var {dec: sunDec, ra: sunRA} = Astronomy.Equator('Sun', new Date(), observer, true, false)
    var civilLHA = LHA(-50/60/360*tau, sunDec/360*tau, latitudeRad);
    var nauticalLHA =LHA(-6/360*tau, sunDec/360*tau, latitudeRad);
    var astronomicalLHA =LHA(-12/360*tau, sunDec/360*tau, latitudeRad);
    var nightLHA =LHA(-18/360*tau, sunDec/360*tau, latitudeRad);
    $(".civil").attr("d", sectorPath(civilLHA));
    $(".nautical").attr("d", sectorPath(nauticalLHA));
    $(".astronomical").attr("d", sectorPath(astronomicalLHA));
    $(".night").attr("d", sectorPath(nightLHA));
}



function addNumbers() {
    for (var i=0; i<24; i++) {
        var radians = i/24*tau;
        var radius = 44;
        var x = 50 + radius * Math.sin(-radians);
        var y = 50 + radius * Math.cos(-radians);
        $(".numbers").append(`\n<text x="${x}" y="${y}">${i}</text>`)
    }
}

function addTicks() {
    var outer = 49;
    var middle = 48;
    var inner = 47;
    var cx = 50;
    var cy = 50;
    for (var i=0; i<120; i++) {
        var radians = i/120*tau;
        if (i%10 == 0) {
            // even hours
            $(".ticks").append(`<line class="hour" x1="${cx + outer * Math.sin(-radians)}" x2="${cx + inner * Math.sin(-radians)}" y1="${cy + outer * Math.cos(-radians)}" y2="${cy + inner * Math.cos(-radians)}" />`)
        } else if (i%10 == 5) {
            // odd hours
            $(".ticks").append(`<line class="hour" x1="${cx + middle * Math.sin(-radians)}" x2="${cx + inner * Math.sin(-radians)}" y1="${cy + middle * Math.cos(-radians)}" y2="${cy + inner * Math.cos(-radians)}" />`)
        } else if (i%2 == 0) {
            // minutes
            $(".ticks").append(`<line class="minute" x1="${cx + outer * Math.sin(-radians)}" x2="${cx + middle * Math.sin(-radians)}" y1="${cy + outer * Math.cos(-radians)}" y2="${cy + middle * Math.cos(-radians)}" />`)
        }
    }
}

function setTime() {
    var time = new Date()
    var hour = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    var ms = Math.round(time.getMilliseconds()/200) * 200;
    var hourHandRad = (hour * tau/24) + (minute * tau/24/60) + (second * tau/24/60/60) + (ms*tau/24/60/60/1000) + tau/2;
    var minuteHandRad = (minute * tau/60) + (second * tau/60/60) + (ms * tau/60/60/1000);
    var secondHandRad = (second * tau/60) + (ms * tau/60/1000);
    $(".hands .second").css("transform", `rotate(${secondHandRad}rad)`);
    $(".hands .minute").css("transform", `rotate(${minuteHandRad}rad)`);
    $(".hands .hour").css("transform", `rotate(${hourHandRad}rad)`);
}

$(document).ready(function(){
    drawFaceRegions();
    addNumbers();
    addTicks();
    setTime();
    $("body").html($("body").html());
});

