#import <Cordova/CDV.h>
#import "MQTTKit.h"

@interface AdafruitIO : CDVPlugin

@property (nonatomic, strong) MQTTClient *client;

- (void) connect:(CDVInvokedUrlCommand*)command;
- (void) setListener:(CDVInvokedUrlCommand*)command;
- (void) disconnect:(CDVInvokedUrlCommand*)command;
- (void) publish:(CDVInvokedUrlCommand*)command;
- (void) subscribe:(CDVInvokedUrlCommand*)command;

@end
