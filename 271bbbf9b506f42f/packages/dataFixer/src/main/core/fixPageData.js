define([
        'lodash',
        'experiment',
        'loggingUtils',
        'dataFixer/plugins/galleriesMobileTypeFixer',
        'dataFixer/plugins/pageTopFixer',
        'dataFixer/plugins/masterPageFixer',
        'dataFixer/plugins/menuFixer',
        'dataFixer/plugins/verticalMenuFixer',
        'dataFixer/plugins/skinFixer',
        'dataFixer/plugins/stylesFixer',
        'dataFixer/plugins/bgImageStripDataFixer',
        'dataFixer/plugins/compFixer',
        'dataFixer/plugins/galleryFixer',
        'dataFixer/plugins/behaviorsFixer',
        'dataFixer/plugins/connectionsDataFixer',
        'dataFixer/plugins/fiveGridLineLayoutFixer',
        'dataFixer/plugins/toPageAnchorsFixer',
        'dataFixer/plugins/wrongAnchorsFixer',
        'dataFixer/plugins/addMissingAnchorsOfMasterPage',
        'dataFixer/plugins/customSiteMenuFixer',
        'dataFixer/plugins/sitePagesFixer',
        'dataFixer/plugins/linkRefDataFixer',
        'dataFixer/plugins/fromDocumentToThemeData',
        'dataFixer/plugins/tpaGluedWidgetDataFixer',
        'dataFixer/plugins/compsWithImagesDataFixer',
        'dataFixer/plugins/appPartCustomizationsFixer',
        'dataFixer/plugins/backgroundMediaConverter',
        'dataFixer/plugins/backgroundMediaUndefinedFixer',
        'dataFixer/plugins/backgroundMediaRefDuplicationFixer',
        'dataFixer/plugins/stripContainerBgEffectFixer',
        'dataFixer/plugins/documentMediaFixer',
        'dataFixer/plugins/pinterestFollowFixer',
        'dataFixer/plugins/blogPageMenuFixer',
        'dataFixer/plugins/appPartMediaInnerCustomizationFormatFixer',
        'dataFixer/plugins/appPartReadMoreValueCustomizationFormatFixer',
        'dataFixer/plugins/appPartTagsValueCustomizationFormatFixer',
        'dataFixer/plugins/appPartDuplicateCustomizationFixer',
        'dataFixer/plugins/blogCustomFeedPostsPerPageCustomizationFixer',
        'dataFixer/plugins/blogDateAlignmentCustomizationFixer',
        'dataFixer/plugins/appPartBrokenButtonStyleFixer',
        'dataFixer/plugins/blogDateFormatCustomizationFormatFixer',
        'dataFixer/plugins/contactFormDataFixer',
        'dataFixer/plugins/subscribeFormDataFixer',
        'dataFixer/plugins/pageDataFixer',
        'dataFixer/plugins/groupFixer',
        'dataFixer/plugins/textSecurityFixer',
        'dataFixer/plugins/pageUriSeoFixer',
        'dataFixer/plugins/migrateStripToColumnsContainer',
        'dataFixer/plugins/tinyMenuSkinBackgroundFixer',
        'dataFixer/plugins/designDataFixer',
        'dataFixer/plugins/homePageLoginDataFixer',
        'dataFixer/plugins/characterSetsFixer',
        'dataFixer/plugins/popupPropsTempDataFixer',
        'dataFixer/plugins/blogSelectionSharerCustomizationsFixer',
        'dataFixer/plugins/nicknameTempFixer',
        'dataFixer/plugins/boxSlideShowDataFixer'
    ],
    function (_,
              experiment,
              loggingUtils,
              galleriesMobileTypeFixer,
              pageTopFixer,
              masterPageFixer,
              menuFixer,
              verticalMenuFixer,
              skinFixer,
              stylesFixer,
              bgImageStripDataFixer,
              compFixer,
              galleryFixer,
              behaviorsFixer,
              connectionsDataFixer,
              fiveGridLineLayoutFixer,
              toPageAnchorsFixer,
              wrongAnchorsFixer,
              addMissingAnchorsOfMasterPage,
              customSiteMenuFixer,
              sitePagesFixer,
              linkRefDataFixer,
              fromDocumentToThemeData,
              tpaGluedWidgetDataFixer,
              compsWithImagesDataFixer,
              appPartCustomizationsFixer,
              backgroundMediaConverter,
              backgroundMediaUndefinedFixer,
              backgroundMediaRefDuplicationFixer,
              stripContainerBgEffectFixer,
              documentMediaFixer,
              pinterestFollowFixer,
              blogPageMenuFixer,
              appPartMediaInnerCustomizationFormatFixer,
              appPartReadMoreValueCustomizationFormatFixer,
              appPartTagsValueCustomizationFormatFixer,
              appPartDuplicateCustomizationFixer,
              blogCustomFeedPostsPerPageCustomizationFixer,
              blogDateAlignmentCustomizationFixer,
              appPartBrokenButtonStyleFixer,
              blogDateFormatCustomizationFormatFixer,
              contactFormDataFixer,
              subscribeFormDataFixer,
              pageDataFixer,
              groupFixer,
              textSecurityFixer,
              pageUriSeoFixer,
              migrateStripToColumnsContainer,
              tinyMenuSkinBackgroundFixer,
              designDataFixer,
              homePageLoginDataFixer,
              characterSetsFixer,
              popupPropsTempDataFixer,
              blogSelectionSharerCustomizationsFixer,
              nicknameTempFixer,
              boxSlideShowDataFixer) {
        'use strict';

        var plugins = _.compact([
            galleriesMobileTypeFixer,
            masterPageFixer,
            backgroundMediaConverter,
            backgroundMediaUndefinedFixer,
            backgroundMediaRefDuplicationFixer,
            menuFixer,
            customSiteMenuFixer,
            verticalMenuFixer,
            skinFixer,
            stylesFixer,
            bgImageStripDataFixer,
            compFixer,
            galleryFixer,
            behaviorsFixer,
            connectionsDataFixer,
            experiment.isOpen('fix_nicknames') && nicknameTempFixer,
            fiveGridLineLayoutFixer,
            toPageAnchorsFixer,
            wrongAnchorsFixer,
            addMissingAnchorsOfMasterPage,
            sitePagesFixer,
            linkRefDataFixer,
            fromDocumentToThemeData,
            pageTopFixer,
            tpaGluedWidgetDataFixer,
            compsWithImagesDataFixer,
            appPartCustomizationsFixer,
            designDataFixer,
            stripContainerBgEffectFixer,
            documentMediaFixer,
            pinterestFollowFixer,
            blogPageMenuFixer,
            appPartMediaInnerCustomizationFormatFixer,
            appPartReadMoreValueCustomizationFormatFixer,
            appPartTagsValueCustomizationFormatFixer,
            blogCustomFeedPostsPerPageCustomizationFixer,
            blogDateAlignmentCustomizationFixer,
            appPartDuplicateCustomizationFixer,
            appPartBrokenButtonStyleFixer,
            blogDateFormatCustomizationFormatFixer,
            contactFormDataFixer,
            subscribeFormDataFixer,
            pageDataFixer,
            groupFixer,
            textSecurityFixer,
            pageUriSeoFixer,
            migrateStripToColumnsContainer,
            tinyMenuSkinBackgroundFixer,
            homePageLoginDataFixer,
            popupPropsTempDataFixer,
            characterSetsFixer,
            blogSelectionSharerCustomizationsFixer,
            boxSlideShowDataFixer
        ]);

        return function fixPageData(pageJson, pageIdsArray, requestModel, currentUrl, urlFormatModel, isViewerMode) {
            var pageId = pageJson.structure.id;
            if (!pageId) {
                pageId = ' masterPage';
            } else if (pageId.length === 5 || pageId.length === 4) {
                pageId = '';
            } else {
                pageId = ' ' + pageId;
            }
            return loggingUtils.performance.time('Fix page' + pageId, function () {
                var data = pageJson.data || {};
                data.document_data = data.document_data || {};
                data.theme_data = data.theme_data || {};
                data.component_properties = data.component_properties || {};
                pageJson.data = data;
                _.forEach(plugins, function (plugin) {
                    plugin.exec(pageJson, pageIdsArray, requestModel, currentUrl, urlFormatModel, isViewerMode);
                });
                return pageJson;
            }, true);
        };
    });
