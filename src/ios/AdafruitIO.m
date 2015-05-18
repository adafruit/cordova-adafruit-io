#import "AdafruitIO.h"
#import "MQTTKit.h"

#define kMQTTServerHost @"io.adafruit.com"

@implementation AdafruitIO
@synthesize client;

- (void)connect:(CDVInvokedUrlCommand*)command
{

  NSString *clientID = [UIDevice currentDevice].identifierForVendor.UUIDString;
  self.client = [[MQTTClient alloc] initWithClientId:clientID];

  self.client.username = [command.arguments objectAtIndex:0];

  [self.client connectToHost:kMQTTServerHost completionHandler:^(MQTTConnectionReturnCode code) {

    CDVPluginResult* pluginResult = nil;

    if(code == ConnectionAccepted) {
      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    } else {
      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Adafruit IO connection failed"];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

  }];

}

- (void)disconnect:(CDVInvokedUrlCommand*)command
{

  [self.client disconnectWithCompletionHandler:^(NSUInteger code) {
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
  }];

}

- (void)subscribe:(CDVInvokedUrlCommand*)command
{

  NSString* topic = @"api/feeds/REPLACE/data/receive.json";
  topic = [topic stringByReplacingOccurrencesOfString:@"REPLACE" withString:[command.arguments objectAtIndex:0]];

  [self.client subscribe:topic withCompletionHandler:^(NSArray *grantedQos) {
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
  }];

}

- (void)setListener:(CDVInvokedUrlCommand*)command
{

  [self.client setMessageHandler:^(MQTTMessage *message) {
    NSString *payload = [[NSString alloc] initWithData: message.payload encoding:NSUTF8StringEncoding];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:[NSArray arrayWithObjects: message.topic, payload, nil]];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
  }];

}

- (void)publish:(CDVInvokedUrlCommand*)command
{

  CDVPluginResult* pluginResult = nil;
  NSString* topic = @"api/feeds/REPLACE/data/send.json";
  topic = [topic stringByReplacingOccurrencesOfString:@"REPLACE" withString:[command.arguments objectAtIndex:0]];

  [self.client publishString:[command.arguments objectAtIndex:1]
                       toTopic:topic
                       withQos:AtMostOnce
                        retain:YES
             completionHandler:nil];

  pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}

@end
