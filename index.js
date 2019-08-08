maxPrepared = 0
preparedCount = 0
preparedSpells = []
fullCaster = ['druid', 'cleric']
halfCaster = ['paladin']

$(document).ready(function() { 
    getSpells();

    $('#class').change(function(){
        preparedSpells = [];
        $('#level0Prep').empty()
        $('#level1Prep').empty()
        $('#level2Prep').empty()
        $('#level3Prep').empty()
        $('#level4Prep').empty()
        $('#level5Prep').empty()
        $('#level6Prep').empty()
        $('#level7Prep').empty()
        $('#level8Prep').empty()
        $('#level9Prep').empty()
        var characterClass = $('#class').find(":selected").val();
        var level = $('#level').val();
        var mod = $('#mod').val();
        updatePrepared(characterClass, parseInt(level, 10), parseInt(mod, 10))
        getSpells(characterClass);
    });

    $('#level').change(function(){
        var characterClass = $('#class').find(":selected").val();
        var level = $('#level').val();
        var mod = $('#mod').val();
        updatePrepared(characterClass, parseInt(level, 10), parseInt(mod, 10))
        getSpells(characterClass, level)
    });

    $('#mod').change(function(){
        var characterClass = $('#class').find(":selected").val();
        var level = $('#level').val();
        var mod = $('#mod').val();
        updatePrepared(characterClass, parseInt(level, 10), parseInt(mod, 10))
    });
}); 

function updatePrepared(characterClass, level, mod)
{   
    console.log('string: '+characterClass)
    console.log('item to compare it to: '+fullCaster[0])
    console.log('equal?: ')
    console.log(characterClass == fullCaster[0])
    if(characterClass == '' || level == '' || mod == '') return
    if(fullCaster.includes(characterClass))
    {
        maxPrepared = mod+level;
    }
    else if(halfCaster.includes(characterClass))
    {
        maxPrepared = mod+Math.floor(level/2);
    }
    $('#preparedCount').text('Prepared Count: ['+preparedCount+' / '+maxPrepared+']');
}

function getSpells(characterClass='', level=20) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            var spellList = JSON.parse(xhttp.responseText).results;
            $('#level0').empty()
            $('#level1').empty()
            $('#level2').empty()
            $('#level3').empty()
            $('#level4').empty()
            $('#level5').empty()
            $('#level6').empty()
            $('#level7').empty()
            $('#level8').empty()
            $('#level9').empty()
            for(var i=0; i<spellList.length;i++)
            {
                appendSpell(spellList[i], level)
            }
        }
    }
    xhttp.open("GET", 'http://www.dnd5eapi.co/api/spells/'+characterClass, true);
    xhttp.send();
}

function appendSpell(spell, level) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == XMLHttpRequest.DONE) {
            var spellInfo = JSON.parse(xhttp.responseText);
            spellDescription = spellInfo.desc.join(' ')
            var descLength = 500;
            if(spellDescription.length > descLength)
            {
                spellDescription = spellDescription.substring(0,descLength) + '...';
            }
            if(spellInfo.level < 0)
            {
                spellInfo.level = 0;
            }
            if(Math.ceil(level/2) >= spellInfo.level && !preparedSpells.includes('spell'+spellInfo.name))
            {
                $('#level'+spellInfo.level).append(spellTemplate(spellInfo.name, spellDescription, spellInfo.level));
            }
        }
    }
    xhttp.open("GET", spell.url, true);
    xhttp.send();
}

function spellTemplate(name, desc, level) {
    return '<div class="spell" id="spell'+name+'" draggable="true" ondragstart="drag(event)">'+name+'<br>'+desc+'<br><br>Level: '+level+'</div>';
}

function levelSort(a, b) {
    if(a.level > b.level) return 1;
    if(b.level > a.level) return -1;
    return 0;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  spell = document.getElementById(data);
  spellLevel = spell.textContent.match(/(?<=Level: )[0-9]/)[0];
  $('#level'+spellLevel+'Prep').append(spell);
  preparedSpells.push(spell.id)
  preparedCount++;
}