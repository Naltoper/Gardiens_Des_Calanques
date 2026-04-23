import React, { PropsWithChildren } from 'react';
import { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Progress } from '../../../../utils/utils';
export type AttachmentUploadProgressIndicatorProps = {
    /** Action triggered when clicked indicator */
    onPress?: PressableProps['onPress'];
    /** style */
    style?: StyleProp<ViewStyle>;
    /** Type of active indicator */
    type?: Progress;
};
export declare const AttachmentUploadProgressIndicator: {
    (props: PropsWithChildren<AttachmentUploadProgressIndicatorProps>): React.JSX.Element;
    displayName: string;
};
//# sourceMappingURL=AttachmentUploadProgressIndicator.d.ts.map