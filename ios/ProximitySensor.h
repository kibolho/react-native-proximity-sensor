
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNProximitySensorSpec.h"

@interface ProximitySensor : NSObject <NativeProximitySensorSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ProximitySensor : NSObject <RCTBridgeModule>
#endif

@end
