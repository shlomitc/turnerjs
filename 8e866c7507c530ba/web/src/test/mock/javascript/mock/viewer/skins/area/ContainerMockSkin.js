define.skin('mock.viewer.skins.area.ContainerMockSkin', function(SkinDefinition) {

    /** @type core.managers.skin.SkinDefinition */

    var def=SkinDefinition;

    def.inherits('core.managers.skin.BaseSkin2');
    def.html(
            '<div skinPart="bg">' +
            '</div>' +
            '<div skinPart="inlineContent">' +
            '</div>');



});