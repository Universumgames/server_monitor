import * as types from "server_mgt-lib/types"

export function getStatusIndicatorColor(basicDevice: types.IDevice): string {
    switch (basicDevice.state) {
        case types.DeviceState.RUNNING:
            return "var(--success-color)"
        case types.DeviceState.STOPPED:
            return "var(--error-color)"
        default:
            return "gray"
    }
}