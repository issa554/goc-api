

'use strict';

/**
 * document controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::document.document', {
    async findByUserId(ctx) {
        try {
            const userId = ctx.params.userid;
            
            if (!userId) {
                return ctx.badRequest('User not authenticated');
            }

            console.log('User ID:', userId);
            console.log('Original Filters:', ctx.query.filters);

            ctx.query.filters = {
                ...(ctx.query.filters || {}),
                user: userId
            };

            console.log('Modified Filters:', ctx.query.filters);

            return await super.find(ctx);
        } catch (error) {
            console.error('Error in find method:', error);
            return ctx.internalServerError('Internal Server Error');
        }
    },
   
    
});



