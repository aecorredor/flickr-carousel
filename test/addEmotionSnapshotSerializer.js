/* eslint-disable import/no-extraneous-dependencies */
import * as emotion from 'emotion';
import { createSerializer, createMatchers } from 'jest-emotion';

// eslint-disable-next-line no-undef
expect.addSnapshotSerializer(createSerializer(emotion));
expect.extend(createMatchers(emotion));
