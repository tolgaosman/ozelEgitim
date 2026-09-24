<?php

namespace Tests;

use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * `SiteSetting::current()` memoizes the singleton row in a static
     * property for the lifetime of the PHP process. PHPUnit runs every test
     * in the same process, so without this reset a row created (or its
     * email changed) in one test would leak into the next test's assertions
     * even though `RefreshDatabase` rolls back the database itself.
     */
    protected function setUp(): void
    {
        parent::setUp();

        SiteSetting::forgetMemoizedRecord();
    }
}
