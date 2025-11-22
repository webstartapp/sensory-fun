import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    serverExternalPackages: ['knex', 'bcryptjs'],
    reactCompiler: true,
};

export default withNextIntl(nextConfig);
