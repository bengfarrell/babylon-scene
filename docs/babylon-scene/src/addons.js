export const pointer = {
    add(scope) {
        scope.stage.scene.onPointerObservable.add((pointerInfo) => {
            if (scope.onPointer) {
                scope.onPointer(pointerInfo);
            }

            if (scope.onMeshPointer) {
                const pick = scope.stage.scene.pick(pointerInfo.event.clientX, pointerInfo.event.clientY);
                if (pick.hit) {
                    scope.onMeshPointer(pick, pointerInfo);
                }
            }
        });
    }
};

export const xrcontrollers = {
    add(scope) {
        scope.xrcontrollers = [];
        scope._xrcontrollerButtonStates = [];

        const notifyApp = function(eventtype, button, controller) {
            const ray = controller.getForwardRay(99999);
            const pick = scope.stage.scene.pickWithRay(ray);
            if (scope.onControllerEvent) {
                scope.onControllerEvent(eventtype, button, controller, pick);
            }
        };

        scope.stage.webxr.then( result => {
            const helper = result;
            if (helper.fallbackToWebVR) {
                helper.enableInteractions();
                helper.onControllerMeshLoadedObservable.add(controller => {
                    controller.onMainButtonStateChangedObservable.add((button) => {
                        notifyApp('mainbutton', button, controller);
                    });
                    controller.onTriggerStateChangedObservable.add((button) => {
                        notifyApp('trigger', button, controller);
                    });
                    controller.onSecondaryButtonStateChangedObservable.add((button) => {
                        notifyApp('secondarybutton', button, controller);
                    });
                    controller.onPadStateChangedObservable.add( (button) => {
                        notifyApp('padstate', button, controller);
                    });
                    controller.onPadValuesChangedObservable.add( (button) => {
                        notifyApp('padvalue', button, controller);
                    });

                    scope.xrcontrollers.push(controller);
                });
            }
        });
    }
};

