Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupCommandUIMiddlewares = void 0;
var _streamChat = require("stream-chat");
var setupCommandUIMiddlewares = exports.setupCommandUIMiddlewares = function setupCommandUIMiddlewares(messageComposer) {
  messageComposer.compositionMiddlewareExecutor.insert({
    middleware: [(0, _streamChat.createCommandInjectionMiddleware)(messageComposer)],
    position: {
      after: 'stream-io/message-composer-middleware/attachments'
    },
    unique: true
  });
  messageComposer.draftCompositionMiddlewareExecutor.insert({
    middleware: [(0, _streamChat.createDraftCommandInjectionMiddleware)(messageComposer)],
    position: {
      after: 'stream-io/message-composer-middleware/draft-attachments'
    }
  });
  messageComposer.textComposer.middlewareExecutor.insert({
    middleware: [(0, _streamChat.createActiveCommandGuardMiddleware)()],
    position: {
      before: 'stream-io/text-composer/commands-middleware'
    }
  });
  messageComposer.textComposer.middlewareExecutor.insert({
    middleware: [(0, _streamChat.createCommandStringExtractionMiddleware)()],
    position: {
      after: 'stream-io/text-composer/commands-middleware'
    }
  });
};
//# sourceMappingURL=setupCommandUIMiddlewares.js.map