define.component('Editor.wysiwyg.common.components.facebooklikebox.viewer.FacebookLikeBox', function(componentDefinition, experimentStrategy) {
    /**@type core.managers.component.ComponentDefinition */
    var def = componentDefinition,
        strategy = experimentStrategy;

    def.panel({
        logic: 'wysiwyg.common.components.facebooklikebox.editor.FacebookLikeBoxPanel',
        skin : 'wysiwyg.common.components.facebooklikebox.editor.skins.FacebookLikeBoxPanelSkin'
    });

    def.styles(1);

    def.helpIds({
        componentPanel: '/node/21351'
    });

    def.statics({
        EDITOR_META_DATA: {
            general: {
                settings: true,
                design: false
            }
        }
    });

    def.methods({
        _setSizeLimits: strategy.after(function(){
            var stream = this._data.get('showStream'),
                faces = this._data.get('showFaces');

            this._updateEditingBox((!stream && !faces));
        }),
        _updateEditingBox: function (compact) {
            this._resizableSides = compact ? [] : [
                Constants.BaseComponent.ResizeSides.TOP,
                Constants.BaseComponent.ResizeSides.LEFT,
                Constants.BaseComponent.ResizeSides.BOTTOM,
                Constants.BaseComponent.ResizeSides.RIGHT
            ];
        }
    });
});