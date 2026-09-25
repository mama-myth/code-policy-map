import * as assert from 'assert';
import { FeedbackStore } from '../../feedback/feedbackStore';

class DummyMemento {
    private storage = new Map<string, any>();

    public get<T>(key: string, defaultValue?: T): T {
        return this.storage.has(key) ? (this.storage.get(key) as T) : (defaultValue as T);
    }

    public async update(key: string, value: any): Promise<void> {
        this.storage.set(key, value);
    }
}

suite('Feedback Store Test Suite', () => {
    test('Records feedback entries and calculates summary metrics', async () => {
        const memento = new DummyMemento();
        const store = new FeedbackStore(memento as any);

        await store.recordFeedback('SEC-LOG-001', 'PAT-001', 'helpful');
        await store.recordFeedback('SEC-LOG-002', 'PAT-002', 'not_helpful');
        await store.recordFeedback('SEC-LOG-001', 'PAT-003', 'dismiss');

        const summary = store.getSummary();

        assert.strictEqual(summary.totalFeedback, 3);
        assert.strictEqual(summary.helpfulCount, 1);
        assert.strictEqual(summary.notHelpfulCount, 1);
        assert.strictEqual(summary.dismissCount, 1);

        assert.ok(store.isPatternDismissed('PAT-003'));
        assert.strictEqual(store.isPatternDismissed('PAT-001'), false);
    });

    test('Clears feedback entries correctly', async () => {
        const memento = new DummyMemento();
        const store = new FeedbackStore(memento as any);

        await store.recordFeedback('SEC-LOG-001', 'PAT-001', 'helpful');
        await store.clearFeedback();

        const summary = store.getSummary();
        assert.strictEqual(summary.totalFeedback, 0);
    });
});
