define([
    'lodash',
    'react',
    'core',
    'testUtils',
    'components/components/dialogs/siteMemberDialogs/memberLoginDialog/memberLoginDialog',
    'reactDOM'
],
    function(_, React, core, /**testUtils*/ testUtils, memberLoginDialog, ReactDOM) {
    'use strict';

    function createComponent(props) {
        return testUtils.getComponentFromDefinition(memberLoginDialog, props);
    }

    describe('memberLoginDialog component', function() {
        var props = {};
        var comp;
        beforeEach(function() {
            spyOn(core.compMixins.animationsMixin, 'sequence').and.callFake(testUtils.mockSequence);

            props = testUtils.mockFactory.mockProps();
            _.assign(props, {
                skin: 'wysiwyg.viewer.skins.dialogs.siteMembersDialogs.memberLoginDialogSkin',
                language: 'en',
                onSubmitCallback: jasmine.createSpy('onSubmitCallback'),
                onCloseDialogCallback: jasmine.createSpy('onCloseDialogCallback'),
                onSwitchDialogLinkClick: jasmine.createSpy('onSwitchDialogLinkClick'),
                onForgetYourPasswordClick: jasmine.createSpy('onForgetYourPasswordClick'),
                needLoginMessage: true
            });
            props.structure.componentType = 'wysiwyg.viewer.components.dialogs.siteMemberDialogs.MemberLoginDialog';

            comp = createComponent(props);
        });

        describe("closing options", function(){
            it("should not have cancel and xButton skin properties if props.notClosable is set", function () {
                props.notClosable = true;
                comp = createComponent(props);
                var skinPropertiesKeys = _.keys(comp.getSkinProperties());
                expect(skinPropertiesKeys).not.toContainAny(['cancel', 'xButton']);
            });
            it("blocking layer should not have an onClick if props.notClosable is set", function(){
                props.notClosable = true;
                comp = createComponent(props);
                var skinProperties = comp.getSkinProperties();
                expect(skinProperties.blockingLayer.onClick).not.toBeDefined();
            });
        });
        describe('validateBeforeSubmit', function(){

            beforeEach(function(){
                comp.refs.emailInput.setState({value: 'a@a.com'});
                comp.refs.passwordInput.setState({value: '1234'});
            });

            it('should fail when email is not well formatted', function(){
                comp.refs.emailInput.setState({value: 'a@'});
                expect(comp.validateBeforeSubmit()).toBeFalsy();
            });

            it('should fail when passwordInput length is less than 4', function(){
                comp.refs.passwordInput.setState({value: '123'});
                expect(comp.validateBeforeSubmit()).toBeFalsy();
            });

            it('should fail when passwordInput length is more than 15', function(){
                comp.refs.passwordInput.setState({value: '1234567890123456'});
                expect(comp.validateBeforeSubmit()).toBeFalsy();
            });

            it('should pass when all three are valid', function(){
                comp.refs.emailInput.setState({value: 'a@a.com'});
                comp.refs.passwordInput.setState({value: '1234'});
                expect(comp.validateBeforeSubmit()).toBeTruthy();
            });

        });

       describe('getDataToSubmit', function(){
            it('should return an object with a "password", "email" and "rememberMe" property', function(){
                comp.refs.emailInput.setState({value: 'a@a.com'});
                comp.refs.passwordInput.setState({value: '1234'});
                var data = comp.getDataToSubmit();
                expect(data).toEqual({'email': 'a@a.com', 'password': '1234', 'rememberMe': false});
            });
        });

        describe('getSkinProperties', function(){
            it('should return the correct skin properties', function(){
                var skinProperties = comp.getSkinProperties();
                expect(skinProperties.title.children).toEqual("Login");
                expect(skinProperties.submitButton.children).toEqual("GO");
                expect(skinProperties.cancel.children).toEqual("Cancel");
                expect(skinProperties.switchDialogLink.children).toEqual("Sign up");
                expect(skinProperties.errMsg.children).toEqual("");
                expect(skinProperties.email.children.props.label).toEqual('Email');
                expect(skinProperties.password.children.props.label).toEqual('Password');
                expect(skinProperties.blockingLayer).toBeDefined();
                expect(skinProperties.xButton).toBeDefined();
                expect(skinProperties.infoTitle.children).toEqual("To view this page, you need to be logged in.");
                expect(skinProperties.note.children).toEqual("Or");
            });

            it('should not show infoTitle if needLoginMessage==false', function(){
                var props2 = testUtils.mockFactory.mockProps();
                _.assign(props2, {
                    skin: 'wysiwyg.viewer.skins.dialogs.siteMembersDialogs.memberLoginDialogSkin',
                    language: 'en',
                    onSubmitCallback: jasmine.createSpy('onSubmitCallback'),
                    onCloseDialogCallback: jasmine.createSpy('onCloseDialogCallback'),
                    onSwitchDialogLinkClick: jasmine.createSpy('onSwitchDialogLinkClick'),
                    onForgetYourPasswordClick: jasmine.createSpy('onForgetYourPasswordClick'),
                    needLoginMessage: false
                });
                props2.structure.componentType = 'wysiwyg.viewer.components.dialogs.siteMemberDialogs.MemberLoginDialog';

                var comp2 = createComponent(props2);

                var skinProperties = comp2.getSkinProperties();
                expect(skinProperties.infoTitle.children).toEqual("");
            });
        });

        describe('GUI', function(){
            it('should activate onSwitchDialogLinkClick when the link is clicked', function(){
                var buttonNode = ReactDOM.findDOMNode(comp.refs.switchDialogLink);
                React.addons.TestUtils.Simulate.click(buttonNode);
                expect(comp.props.onSwitchDialogLinkClick).toHaveBeenCalled();
            });

            it('should activate onForgetYourPasswordClick when the link is clicked', function(){
                var buttonNode = ReactDOM.findDOMNode(comp.refs.forgotYourPasswordLink);
                React.addons.TestUtils.Simulate.click(buttonNode);
                expect(comp.props.onForgetYourPasswordClick).toHaveBeenCalled();
            });

            it('should activate onSubmitCallback when the button is clicked, and the input is valid', function(){
                comp.refs.emailInput.setState({value: 'a@a.com'});
                comp.refs.passwordInput.setState({value: '1234'});
                var buttonNode = ReactDOM.findDOMNode(comp.refs.submitButton);
                React.addons.TestUtils.Simulate.click(buttonNode);
                expect(comp.props.onSubmitCallback).toHaveBeenCalled();
            });

            it('should not activate onSubmitCallback when the button is clicked, but the input is invalid', function(){
                comp.refs.emailInput.setState({value: 'a@a'});
                comp.refs.passwordInput.setState({value: '1234'});
                var buttonNode = ReactDOM.findDOMNode(comp.refs.submitButton);
                React.addons.TestUtils.Simulate.click(buttonNode);
                expect(comp.props.onSubmitCallback).not.toHaveBeenCalled();
            });

            it('should activate onCloseDialogCallback when the cancel button is clicked', function(){
                var buttonNode = ReactDOM.findDOMNode(comp.refs.cancel);
                React.addons.TestUtils.Simulate.click(buttonNode);
                expect(comp.props.onCloseDialogCallback).toHaveBeenCalled();
            });

            it('should activate onCloseDialogCallback when the xButton is clicked', function(){
                var buttonNode = ReactDOM.findDOMNode(comp.refs.xButton);
                React.addons.TestUtils.Simulate.click(buttonNode);
                expect(comp.props.onCloseDialogCallback).toHaveBeenCalled();
            });

            it('should activate onCloseDialogCallback when the blockingLayer is clicked', function(){
                var buttonNode = ReactDOM.findDOMNode(comp.refs.blockingLayer);
                React.addons.TestUtils.Simulate.click(buttonNode);
                expect(comp.props.onCloseDialogCallback).toHaveBeenCalled();
            });

        });
    });
});
