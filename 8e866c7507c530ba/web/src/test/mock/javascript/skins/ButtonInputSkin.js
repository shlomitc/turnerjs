define.skin('wysiwyg.editor.skins.inputs.button.ButtonInputSkin', function(skinDefinition){

    /** @type core.managers.skin.SkinDefinition */
    var def = skinDefinition;
    def.inherits('mobile.core.skins.BaseSkin');
    def.fields({
        _tags: []
    });
    def.compParts(
        {
            button : { skin: 'wysiwyg.editor.skins.buttons.ButtonBaseSkin' }
        }
    );
    def.html(
        '<label skinpart="label"></label>' +
        '<div skinpart="button"></div>'
    );
    def.css(
        [
            '{margin:5px 0;}',
            '[state~="hasLabel"] %button%{padding: 5px;}',
            '[state~="hasLabel"] %label% {display:block;}',
            '[disabled] %label% {opacity:0.5}'
        ]
    );
});
