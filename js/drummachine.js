$(document).ready(function () {
    // get all files and fill the samples hasmap
    var activeKit="ac"; // the samples kit we're using
    var samplesHash = {};
    var numMeasures = 4;
    var numBeats = 4;
    var numTracks = 0;
    var numBeats = 4;
    var sequencerPlaying = 0;
    var playing = false;
    var currMeasure = 0;
    var currBeat = 0;
    var bpm = 240;
    var maxBpm = 600;
    var solo = -1;
    var preloadAmount = 0;
    var preloaded= 0;
    // PLAYER FUNCTIONS
    var play = function(index){
        $('#playlist audio').get(index).play();
    };
    var updateBeatDisplay = function(){
        $('#measureDigit').html((currMeasure+1));
        $('#colonDigit').html(':');
        $('#beatDigit').html((currBeat+1));
    };
    var updateBpmDisplay = function(){
        $('#tempoDisplay').val(bpm);
    };
    
    // HTML fill
    updateBeatDisplay();
    updateBpmDisplay();
    var i = 0;
    $.each($('audio'), function() {
       samplesHash[$(this).attr('data-sound')] = i;
       // insert preload code here
       i++;
    });
    // Fill tracks
    var addGrid = function(track){
        measure=0; beat=0;
        track.append('<div class="spacer"></div>');
        for(measure=0; measure<numMeasures; measure++){
            for( beat=0; beat<numBeats; beat++)
            {
                track.append('<a class="button beat white" id="m'+measure+'-b'+beat+'"></a>');
            }
            track.append('<div class="spacer"></div>');
        }
    };
    
    $.each($('.track'), function() {
        id = samplesHash[$(this).attr('data-sound')];
        $(this).html(
            '<div class="trackTitle" data-sound="'+$(this).attr('data-sound')+'">'+ $(this).attr('data-trackName')+'</div>'+
            '<div class="spacer"></div> <div class="button mute grey" id="mute_'+numTracks+'"data-muteID="'+numTracks+'">M</div>'+'<div class="button grey solo" id="solo_'+numTracks+'" data-soloID="'+numTracks+'">S</div>'
            );
        numTracks++;
        addGrid($(this));
    });
    
    // SEQUENCER CONTORL 
    $('.trackTitle').click(function() {
       $('#samples audio').get(samplesHash[$(this).attr('data-sound')]).currentTime = 0;
       $('#samples audio').get(samplesHash[$(this).attr('data-sound')]).play();
    });
    
    $('.beat').click(function() {
       //$('#samples audio').get(samplesHash[$(this).attr('data-sound')]).play();
       $(this).toggleClass('white');
       $(this).toggleClass('blue');
       $(this).toggleClass('active');
    });
    $('.mute').click(function() {
        trk= $(this).attr('data-muteID');
        sndIndex = samplesHash[$('#track_'+trk).attr('data-sound')];
        if( $(this).hasClass('active') ) $('#samples audio').get(sndIndex).volume = 1;
        else $('#samples audio').get(sndIndex).volume = 0;
        $(this).toggleClass('grey');
        $(this).toggleClass('red');
        $(this).toggleClass('active');
    });
    
    $('.solo').click(function() {
        trk= $(this).attr('data-soloID');
        sndId = samplesHash[$('#track_'+trk).attr('data-sound')];
        $(this).toggleClass('grey');
        $(this).toggleClass('green');
        if(solo<0) solo = trk; // no other tracks where in solo mode
        else if(solo==trk){ // this class was in solo mode, turn it off
            solo = -1;
        }
        else{ // another tracks where in solo mode switch it off and change to this
                $('#solo_'+solo).toggleClass('grey');
                $('#solo_'+solo).toggleClass('green');
                solo = trk;
        }
        pause();
        play();
    });
    // TRANSPORT BAR CONTORL
    var sequencerPlay =  function(measure,beat){
        if(solo<0){
            for( var trk = 0; trk<numTracks ; trk++)
            if($('#track_'+trk+' #m'+measure+'-b'+beat).hasClass('active')){
                snd = samplesHash[$('#track_'+trk).attr('data-sound')];
                $('#samples audio').get(snd).currentTime = 0;
                $('#samples audio').get(snd).play();
            }
        } else{
            if($('#track_'+solo+' #m'+measure+'-b'+beat).hasClass('active')){
                snd = samplesHash[$('#track_'+solo).attr('data-sound')];
                $('#samples audio').get(snd).currentTime = 0;
                $('#samples audio').get(snd).play();
            }
        }
     };
           
    var play = function(){
        if(!playing){
            playing = true;
            sequencerPlaying = setInterval(function() {
                sequencerPlay(currMeasure,currBeat);
                updateBeatDisplay();
                if(++currBeat >= numBeats){
                    currBeat=0;
                    if(++currMeasure >= numMeasures) currMeasure=0;
                }
             }, 60*1000/bpm);
        }
    };       

    var stop = function(){
        playing = false; 
        clearInterval(sequencerPlaying); 
        currBeat=0; 
        currMeasure=0; 
        updateBeatDisplay();
    };
    
    var pause = function(){
        playing = false; 
        clearInterval(sequencerPlaying); 
        updateBeatDisplay();
    };
    $('#play_btn').click(function() {
        play();
    });

    $('#stop_btn').click(function() { 
        stop();
    });

    $('#pause_btn').click(function() { 
        pause();
    });
    
    var SetTempo = function(t){
        if(t>maxBpm) t=maxBpm;
            else if(t<1) t=1;
        bpm=t;
        if(playing) { pause(); play(); }
    };
    
    $('#tempo_plus').click(function() { 
        SetTempo(bpm+1);
        updateBpmDisplay();
    });
    $('#tempo_minus').click(function() { 
        SetTempo(bpm-1);
        updateBpmDisplay();
    });
    
    
    $('#tempoDisplay').change(
        function() { 
            SetTempo(parseInt( $(this).val() ));
            updateBpmDisplay();
        }
    );
    
})


