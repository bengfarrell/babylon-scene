export default {
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
}
