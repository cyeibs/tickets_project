import compose from 'compose-function';
import { withRouter } from './with-router';
import { withQuery } from './with-query';
import { withTelegram } from './with-telegram';

// The order matters here: withQuery should wrap the components that use react-query
// withRouter should be the outermost provider
export const withProviders = compose(
  withQuery, // First apply query provider
  withTelegram, // Then telegram provider
  withRouter, // Router should be the last (outermost) provider
);
